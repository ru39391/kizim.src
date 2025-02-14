import { Template } from 'twig';

export type TModalOptions = {
  btnSel: string;
  overlayClass: string;
  titleSel: string;
  inputSel: string;
};

export type TProjectData = {
  id: number;
  name: string;
  introtext: string;
  content: string;
  bg: string;
  logo: string;
  picture: string;
  fill: string;
  list: string[];
};

export type TEmbedData = {
  video?: string;
  content?: string;
  modalClass?: string;
  isHeaderHidden?: number;
  isFooterHidden?: number;
};

export type TTemplateData = {
  tpl: Template | undefined;
  isSucceed: boolean;
};

export type TTogglerOptions = {
  itemSel: string;
  btnSel: string;
};
