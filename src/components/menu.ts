export interface Item {
  title: string;
  caption?: string;
  icon: string;
  link: string;
  disable?: boolean;
  childs?: Item[];
}

// export interface Items {
//   data: Items[];
// }
