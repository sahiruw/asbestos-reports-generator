
export interface SectionData {
  id: string;
  sampleNo: string;
  idSymbol: string;
  location: string;
  itemMaterialProduct: string;
  quantityExtent: string;
  asbestosType: string;
  notAccessed: boolean;
  notAccessedReason: string;
  isExternal: boolean;
  accessibility: string;
  condition: string;
  image: ImageWithCaption | null;
  // Material Assessment Algorithm
  productType: number; // 1-3
  damageDeteriorationScore: number; // 0-3
  surfaceTreatment: number; // 0-3
  asbestosTypeScore: number; // 1-3
  // Management and Control Actions (text inputs for timescales)
  actionLabel: string;
  actionMonitorReinspect: string;
  actionEncapsulateEnclose: string;
  actionSafeSystemOfWork: string;
  actionRemoveCompetentContractor: string;
  actionRemoveLicensedContractor: string;
  actionManageAccess: string;
}

export interface FormData {
  client: string;
  projectNo: string;
  address: string;
  dateOfSurvey: string;
  reinspectionDate: string;
  numberOfStoreys: string;
  outbuildings: string;
  buildingImages: ImageWithCaption[];
  sections: SectionData[];
}


export interface ImageWithCaption {
  id: string;
  file: File | null;
  preview: string;
  caption?: string;
}