# MARCOS font provenance

TypeScope was used only as a visual reference. Its public page describes the tool as a Google Fonts viewer and catalogue, so the MARCOS assets were obtained from official font publishers rather than from TypeScope.

| Family        | Official source                                                                                                                                                                          | License     | Local selection                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| Space Grotesk | [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500..700&display=swap) and [google/fonts](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) | SIL OFL 1.1 | Latin variable, 500–700               |
| Manrope       | [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=Manrope:wght@400..700&display=swap) and [google/fonts](https://github.com/google/fonts/tree/main/ofl/manrope)            | SIL OFL 1.1 | Latin variable, 400–700               |
| IBM Plex Sans | [Google Fonts CSS API](https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400..700&display=swap) and [google/fonts](https://github.com/google/fonts/tree/main/ofl/ibmplexsans)  | SIL OFL 1.1 | Latin variable, 400–700               |
| IBM Plex Mono | [IBM/plex web package](https://github.com/IBM/plex/tree/master/packages/plex-mono/fonts/complete/woff2)                                                                                  | SIL OFL 1.1 | Regular 400, Medium 500, SemiBold 600 |

The Google Fonts CSS API returned WOFF2 for the first three families. IBM Plex Mono’s official web package provides WOFF2 files per weight, so no TTF fallback was needed.
