# Automobile asset sources

## Vehicle photos

Add photographs to the matching model folder under `assets/automobile/vehicles/`. Use readable, ordered names such as `01-front.jpg`, `02-side.jpg`, and `03-interior.jpg`; any number of photos is supported. Add each relative URL to that vehicle's `images` array in `src/automobile.js`, in the desired display order, for example:

```js
images: [
  "../assets/automobile/vehicles/nammi-box/01-front.jpg",
  "../assets/automobile/vehicles/nammi-box/02-side.jpg"
]
```

The first entry is used by the hero, featured image, and vehicle card. JPEGs already in the shared `vehicles/` directory can be registered directly; do not move them unless all references are updated. This is a static site: browsers cannot discover repository directory contents at runtime.

The model folders are `nammi-box`, `nammi-06-vigo`, `mage-m57`, `mage-s01-ev`, `huge-g59`, `epi-008`, `shine-c65`, `shine-gs-c68`, `voyah-dream`, `voyah-taishan`, `voyah-free-plus`, `m-hero-ii-817`, and `m-hero-i`.

The following existing JPEGs are currently registered in the centralized data:

- `../assets/automobile/vehicles/nammi-01.jpg` — NAMMI BOX (the pictured model is badged NAMMI 01)
- `../assets/automobile/vehicles/dongfeng-mage-m57.jpg` — MAGE M57
- `../assets/automobile/vehicles/dongfeng-ep-e008.jpg` — eπ 008
- `../assets/automobile/vehicles/voyah-taishan.jpg` — VOYAH TAISHAN
- `../assets/automobile/vehicles/m-hero-817.jpg` — M-HERO II 817
- `../assets/automobile/vehicles/m-hero-917.jpg` — M-HERO I (917)

The ROX 01 and VOYAH FREE promotional images are also registered centrally for their existing page sections. Seven of the 13 brochure models have no matching JPEG in this checkout, so their photo arrays remain empty. The Dongfeng pickup JPEG is not assigned to a brochure model.

The repository does not record a source or license for these JPEG files. Confirm usage rights before publication.

## Existing vehicle artwork

- `assets/automobile/vehicles/dongfeng-ep-e008.svg` — editorial fallback for eπ 008
- `assets/automobile/vehicles/dongfeng-mage-m57.svg` — editorial fallback for MAGE M57
- `assets/automobile/vehicles/m-hero-817.svg` — editorial fallback for M-HERO II 817
- `assets/automobile/vehicles/voyah-taishan.svg` — editorial fallback for VOYAH TAISHAN
- Other existing SVG artwork remains in place for existing page content; it is not represented as manufacturer photography.

## Brand wordmarks

- `assets/automobile/brands/dongfeng.svg` — refined text fallback
- `assets/automobile/brands/voyah.svg` — refined text fallback
- `assets/automobile/brands/m-hero.svg` — refined text fallback
- `assets/automobile/brands/nammi.svg` — refined text fallback
- `assets/automobile/brands/rox-motor.svg` — refined text fallback

When adding a sourced photograph, verify the model match and usage rights, then record its source and license here.
