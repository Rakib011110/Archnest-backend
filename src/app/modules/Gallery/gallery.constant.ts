export const GALLERY_SEARCHABLE_FIELDS = ['title', 'category'];
export const GALLERY_ITEM_TYPE = { PHOTO: 'PHOTO', VIDEO: 'VIDEO', VIRTUAL_TOUR: 'VIRTUAL_TOUR' } as const;
export type TGalleryItemType = keyof typeof GALLERY_ITEM_TYPE;
