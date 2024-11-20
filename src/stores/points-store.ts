import { defineStore } from 'pinia';
import { Notify, QSpinnerRadio } from 'quasar'
import { api } from 'src/boot/axios';
import { FeatureCollection } from 'geojson';
import {
  NewPoint,
  PointSetting,
  PointData,
  Relevamiento,
} from 'components/points';

const generateRandomNumber = (min: number = 10000001): number => {
  if (min <= 10000000) {
    min = 10000001;
  }

  const max = Number.MAX_SAFE_INTEGER;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNumber;
};

interface State {
  setting: PointSetting | null;
  point: PointData | null;
  offlinePoints: NewPoint[];
  relevamiento: Relevamiento | null;
}

const urlBase = `${process.env.API}/api/v1/puntos`;
const urlBaseR = `${process.env.API}/api/v1/relevamientos`;

export const usePointsStore = defineStore('points', {
  persistence: {
    enabled: true,
  },

  state: (): State => ({
    setting: null,
    point: null,
    offlinePoints: [],
    relevamiento: null,
  }),

  getters: {
    geojsonPoints(state) {
      const geojson = {
        type: 'FeatureCollection',
        features: state.offlinePoints.map((point: NewPoint) => {
          const coordinates =
            point.longitud !== undefined && point.latitud !== undefined
              ? [point.longitud, point.latitud]
              : [0, 0];

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: coordinates,
            },
            properties: {
              id: point.id,
              nombre: point.nombre,
              observaciones: point.observaciones,
            },
          };
        }),
      };

      return geojson as FeatureCollection;
    },
  },

  actions: {
    setLastPoint(setting: PointSetting) {
      this.setting = setting;
    },

    setPointData(point: PointData) {
      this.point = point;
      const pointSetting: PointSetting = {
        coordinates: {
          lat: point.latitud,
          lng: point.longitud,
        },
        zoom: 16,
      };
      this.setLastPoint(pointSetting);
    },

    async getPoint(id: number) {
      const resp = await api.get(`${urlBase}/${id}`);
      this.point = resp.data;
      return this.point;
    },

    async refreshPoint() {
      if (this.point && this.point.id) {
        const resp = await api.get(`${urlBase}/${this.point.id}`);
        this.point = resp.data;
        return this.point;
      }
    },

    async createPoint(point: NewPoint) {
      if (navigator.onLine) {
        let resp;
        if (point.id) {
          resp = await api.put(`${urlBase}/${point.id}`, point);
        } else {
          resp = await api.post(urlBase, point);
        }
        this.point = resp.data;
      } else {
        point.id = generateRandomNumber();
        point.relevamientos = [];
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        this.offlinePoints?.push(point);

        this.point = {
          id: point.id,
          nombre: point.nombre,
          observaciones: point.observaciones,
          latitud: point.latitud || 0,
          longitud: point.longitud || 0,
          fecha: formattedDate,
          relevamientos_campania: 0,
          relevamientos_total: 0,
          relevamientos: [],
        };
        Notify.create({
          icon: 'offline_pin',
          message: 'Punto guardado en modo offline.',
          color: 'purple-7',
        })

      }
    },

    async confirmPoint(point: PointData) {
      const url = `${urlBase}/${point.id}`;
      const data = { confirmado: true };
      const resp = await api.put(url, data);
      this.point = resp.data;
      return this.point;
    },

    async deletePoint(point: PointData) {
      const url = `${urlBase}/${point.id}`;
      const data = { anulado: true };
      const resp = await api.put(url, data);
      this.point = resp.data;
      return this.point;
    },

    async getRelevamiento(id: number) {
      const resp = await api.get(`${urlBaseR}/${id}`);
      this.relevamiento = resp.data;
      return this.relevamiento;
    },

    async createRelevamiento(relevamiento: Relevamiento) {
      if (navigator.onLine) {
        let resp;
        if (relevamiento.id) {
          resp = await api.put(`${urlBaseR}/${relevamiento.id}`, relevamiento);
          if (this.point && this.point.relevamientos) {
            const index = this.point.relevamientos.findIndex(
              (r) => r.id === relevamiento.id,
            );
            this.point.relevamientos[index] = resp.data;
          }
        } else {
          resp = await api.post(urlBaseR, relevamiento);
          this.point?.relevamientos?.push(resp.data);
          if (relevamiento.punto) {
            await this.getPoint(relevamiento.punto);
          }
        }
        this.relevamiento = resp.data;
        return this.relevamiento;
      } else {
        const idPoint = relevamiento.punto;
        if (idPoint) {
          const pointIndex = this.offlinePoints.findIndex(
            (p) => p.id === idPoint,
          );
          if (pointIndex >= 0) {
            this.offlinePoints[pointIndex].relevamientos?.push(relevamiento);
          }
        }
        Notify.create({
          icon: 'offline_pin',
          message: 'Relevamiento guardado en modo offline.',
          color: 'purple-7',
        })
      }
    },

    async confirmRelevamiento(relevamiento: Relevamiento) {
      const url = `${urlBaseR}/${relevamiento.id}`;
      const data = { confirmado: true };
      const resp = await api.put(url, data);
      this.relevamiento = resp.data;
      return this.relevamiento;
    },

    async deleteRelevamiento(relevamiento: Relevamiento) {
      const url = `${urlBaseR}/${relevamiento.id}`;
      const data = { anulado: true };
      const resp = await api.put(url, data);
      this.relevamiento = resp.data;
      return this.relevamiento;
    },

    async syncPointsOffline() {
      if (navigator.onLine) {

        const offlinePointsCount = this.offlinePoints.length;

        for (let i = 0; i < offlinePointsCount; i++) {
          const point = this.offlinePoints[i];

          if (!point || point.latitud === undefined || point.longitud === undefined) {
            console.warn(`Punto en índice ${i} es inválido:`, point);
            continue; // Saltar a la siguiente iteración si el punto es inválido
          }
          const { id, ...pointDataWithoutId } = point;
          try {
            const response = await api.post(urlBase, pointDataWithoutId);
            const newId = response.data.id;
            if (point.relevamientos) {
              for (const relevamiento of point.relevamientos) {
                relevamiento.punto = newId;
                await api.post(urlBaseR, relevamiento);
              }
            }

            this.offlinePoints.splice(i, 1);
            i--;
          } catch (error) {
            console.error(`Error syncing point ${id}:`, error);
          }
        }
        if (offlinePointsCount > 0) {
          Notify.create({
            // icon: 'sync',
            spinner: QSpinnerRadio,
            message: `Se enviaron al servidor ${offlinePointsCount} datos creados en modo offline`,
            color: 'amber-8',
          })
        }
      }
    }
  }
});
