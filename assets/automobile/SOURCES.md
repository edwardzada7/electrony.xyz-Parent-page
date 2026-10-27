# Automobile asset sources

The Dongfeng range and pickup PDFs are local source material, not public assets. The pickup source is `automobile/Dongfeng_Pickups_-_Fouani_Nigeria_(with_prices).pdf`; the static build excludes PDFs. Do not copy source PDFs into public assets or a release build.

## Vehicle photos

Add photographs to the matching model folder under `assets/automobile/vehicles/`. Use readable, ordered names such as `01-front.jpg`, `02-side.jpg`, and `03-interior.jpg`; any number of photos is supported. Add each relative URL to that vehicle's `images` array in `src/automobile-catalogue.js`, in the desired display order, for example:

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

The ROX 01 and VOYAH FREE promotional images are also registered centrally for their existing page sections. All 13 brochure models currently have at least one registered JPEG. The following brochure-derived pickup photographs are registered:

- `../assets/automobile/vehicles/dongfeng-rich-6t/01-exterior.jpg` — RICH 6T
- `../assets/automobile/vehicles/dongfeng-rich-6/01-exterior.jpg` — RICH 6
- `../assets/automobile/vehicles/dongfeng-rich-7/01-exterior.jpg` — RICH 7
- `../assets/automobile/vehicles/dongfeng-z9/01-exterior.jpg` — Z9

These images are extracted from the pickup brochure. The repository does not establish publication rights; confirm usage rights before release.

The existing `../assets/automobile/vehicles/dongfeng-pickup.jpg` is not assigned to a brochure model.

The repository does not record a source or license for these JPEG files. Confirm usage rights before publication.

## Vehicle videos

Place MP4 files in the matching model folder under `assets/automobile/vehicles/`, using readable ordered filenames such as `01-exterior.mp4` or `02-driving.mp4`. Register each real file in that model's `videos` array in `src/automobile-catalogue.js`; the optional `title` is shown above the player:

```js
videos: [
  { src: "../assets/automobile/vehicles/nammi-box/01-exterior.mp4", title: "Exterior walkaround" }
]
```

The existing photo/media gallery renders registered videos with native controls and uses the vehicle's first registered photograph as the poster when available. Leave `videos: []` for vehicles without videos. This is a static site: browsers cannot discover files in repository folders automatically, and unregistered files are not displayed.

The two MP4 files in `dongfeng-z9/` are registered with the existing Z9 entry. The five photographs and three MP4 clips in `roxmotor1/` are registered with the existing ROX Motor showcase; their specific ROX trim is not asserted by the available source material.

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
