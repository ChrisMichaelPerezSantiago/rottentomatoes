# Unofficial Rotten Tomatoes Library
This unofficial library provides access to movie and TV show information from Rotten Tomatoes. It enables users to retrieve various details such as ratings, reviews, and additional insights, facilitating seamless interaction with Rotten Tomatoes data.

Project in progress ...

## Prerequisites

- [x] `Node.js >= 18.x`
- [x] `Yarn >= 1.x`

# 📚 Documentation

## Search for Movies or TV Shows
Utilize the search function to find movies or TV shows by their title. This function returns a list of relevant results based on the search query.

```typescript
import { search } from 'rottentomatoes'

const q = 'Harry Potter and the deathly hallows 2'
const results = await search(q)
```

## Search Schema

The `SearchSchema` defines the structure of the data returned by the search API. Below is a detailed description of each field within the schema:

| Field      | Type                                   | Description                                                                      |
|------------|----------------------------------------|----------------------------------------------------------------------------------|
| `id`       | `String` or `null`                    | Unique identifier for the search result.                                        |
| `title`    | `String` or `null`                    | Title of the movie or TV show.                                                 |
| `cast`     | `Array of Strings` or `null`          | Array of cast members.                                                          |
| `year`     | `Number` (from string) or `null`     | Release year as a number.                                                       |
| `score`    | `Number` (from string) or `null`     | Rating score as a number.                                                       |
| `mediaType`| `String` or `null`                    | Type of media (e.g., movie, TV show).                                          |
| `poster`   | `String` or `null`                    | URL of the poster image.                                                        |

## Get Extra Content
Utilize the getExtraContent function to retrieve additional information about a movie or TV show.

```typescript
import { getExtraContent } from 'rottentomatoes'

const id = 'm/harry_potter_and_the_deathly_hallows_part_2'
const result = await getExtraContent(id)
```

## ExtraContent Schema

The `ExtraContentSchema` defines the structure for the additional content retrieved for a media item. Below are the details of each field in the schema:

| Field                     | Type                                               | Description                                                        |
|---------------------------|----------------------------------------------------|--------------------------------------------------------------------|
| `synopsis`                | `NullOr(String)`                                   | A brief summary of the media item's plot or storyline.             |
| `castAndCrew`             | `NullOr(Array)`                                    | An array of objects containing details about cast and crew. Each object includes: |
|                           | - `name: String`                                  | The name of the cast or crew member.                               |
|                           | - `role: String`                                  | The role of the individual (e.g., actor, director).               |
|                           | - `poster: String`                                | The URL of the individual's poster image.                          |
|                           | - `id: String`                                    | The unique identifier for the cast or crew member.                |
| `director`                | `NullOr(Array)`                                    | An array of directors associated with the media item.              |
| `producer`                | `NullOr(Array)`                                    | An array of producers associated with the media item.              |
| `seasons`                 | `NullOr(Array)`                                    | An array of seasons for TV shows, structured according to `SeasonSchema`. |
| `screenwriter`            | `NullOr(Array)`                                    | An array of screenwriters associated with the media item.          |
| `distributor`             | `NullOr(String)`                                   | The name of the distributor for the media item.                    |
| `productionCompanies`     | `NullOr(Array)`                                    | An array of production companies involved in creating the media item. |
| `network`                 | `NullOr(String)`                                   | The network that aired the media item (for TV shows).              |
| `rating`                  | `NullOr(String)`                                   | The rating of the media item (e.g., PG, R).                       |
| `genres`                  | `NullOr(Array)`                                    | An array of genres associated with the media item.                 |
| `originalLanguage`        | `NullOr(String)`                                   | The original language in which the media item was produced.        |
| `releaseDateTheaters`     | `NullOr(String)`                                   | The release date of the media item in theaters.                   |
| `releaseDateStreaming`    | `NullOr(String)`                                   | The release date of the media item for streaming.                 |
| `boxOfficeGross`         | `NullOr(String)`                                   | The total box office gross revenue of the media item.              |
| `runtime`                 | `NullOr(String)`                                   | The runtime duration of the media item.                            |
| `soundMix`                | `NullOr(Array)`                                    | An array of sound mixes used in the media item.                   |
| `promoEndpoint`           | `NullOr(String)`                                   | The promo video endpoint (m3u8) for the media item.               |

## Get TopCritics

```typescript
import { getTopCritics } from 'rottentomatoes'

const id = 'm/harry_potter_and_the_deathly_hallows_part_2'
const row = await getTopCritics(id)
```

## TopCritics Schema

The `TopCriticsSchema` defines the structure for top critic reviews of a specific media item. Each field provides details about a critic's review, including the critic's identity, publication, and additional context for the review.

| Field            | Type                | Description                                                     |
|------------------|---------------------|-----------------------------------------------------------------|
| `reviewerId`     | `NullOr(String)`    | Unique identifier for the reviewer.                             |
| `reviewer`       | `NullOr(String)`    | Name of the reviewer.                                           |
| `publication`    | `NullOr(String)`    | The publication that the review is associated with.             |
| `quote`          | `NullOr(String)`    | A quote or excerpt from the review.                             |
| `originalScore`  | `NullOr(String)`    | The score or rating given by the reviewer, in its original format. |
| `reviewDate`     | `NullOr(String)`    | Date when the review was published.                             |
| `reviewLink`     | `NullOr(String)`    | URL link to the full review.                                    |
| `criticPicture`  | `NullOr(String)`    | URL of the critic's picture.                                    |

## Get Critic

```typescript
import { getCritic } from 'rottentomatoes'

const reviewerId = 'critics/christopher-kelly'
const criticMediaType = 'movies'

const row = await getCritic(reviewerId, mediaType)
```

## Critic Schema

The `CriticSchema` defines the structure for the data returned by the getCritic function.

## CriticsSchema

The `CriticsSchema` captures the details of a critic's profile, including their biography and individual reviews.

### CriticReviewSchema

Each review provided by a critic is structured as follows:

| Field             | Type                       | Description                                                        |
|-------------------|----------------------------|--------------------------------------------------------------------|
| `rating`          | `NullOr(String)`           | Rating provided by the critic in text format.                      |
| `tomatometerScore`| `NullOr(NumberFromString)` | Numeric score on the tomatometer scale.                            |
| `title`           | `NullOr(String)`           | Title of the media reviewed.                                       |
| `year`            | `NullOr(NumberFromString)` | Year of the media release.                                         |
| `reviewSnippet`   | `NullOr(String)`           | Short excerpt or summary of the review.                            |
| `publication`     | `NullOr(String)`           | Name of the publication where the review was published.            |
| `reviewLink`      | `NullOr(String)`           | URL link to the full review.                                       |
| `reviewDate`      | `NullOr(String)`           | Date when the review was published.                                |

### CriticBioSchema

The critic's biographical information is captured as follows:

| Field             | Type                       | Description                                                        |
|-------------------|----------------------------|--------------------------------------------------------------------|
| `name`            | `NullOr(String)`           | Name of the critic.                                                |
| `image`           | `NullOr(String)`           | URL to an image of the critic.                                     |
| `approvalStatus`  | `NullOr(String)`           | Status of the critic’s approval, if available.                     |
| `publications`    | `NullOr(Array(NullOr(String)))` | List of publications the critic is associated with.            |
| `criticsGroup`    | `NullOr(String)`           | Name of the critics' group or association.                         |

### Full Schema Structure

The `CriticsSchema` combines both the `bio` and `reviews` data structures:

| Field     | Type                        | Description                                |
|-----------|-----------------------------|--------------------------------------------|
| `reviews` | `Array(CriticReviewSchema)` | Array of individual reviews by the critic. |
| `bio`     | `CriticBioSchema`           | Biographical information of the critic.    |

## **:handshake: Contributing**

- Fork it!
- Create your feature branch: `git checkout -b my-new-feature`
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request

---

### **:busts_in_silhouette: Credits**

- [Chris Michael](https://github.com/ChrisMichaelPerezSantiago) (Project Leader, and Developer)

---

### **:anger: Troubleshootings**

This is just a personal project created for study / demonstration purpose and to simplify my working life, it may or may
not be a good fit for your project(s).

---

### **:heart: Show your support**

Please :star: this repository if you like it or this project helped you!\
Feel free to open issues or submit pull-requests to help me improving my work.

---

### **:robot: Author**

_*Chris M. Perez*_

> You can follow me on
> [github](https://github.com/ChrisMichaelPerezSantiago)&nbsp;&middot;&nbsp;[twitter](https://twitter.com/Chris5855M)

---

Copyright ©2024 [Rotten tomatoes](https://github.com/ChrisMichaelPerezSantiago/rottentomatoes).
