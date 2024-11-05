import { Schema } from 'effect'

const HttpClientConfigSchema = Schema.Struct({
  baseUrl: Schema.String,
})

const responseTypeSchema = Schema.Union(
  Schema.Literal('json'),
  Schema.Literal('text'),
  Schema.Literal('blob'),
  Schema.Literal('arrayBuffer'),
)

const CriticMediaTypeSchema = Schema.Union(
  Schema.Literal('movies'),
  Schema.Literal('tv'),
)

const SearchURLParamsSchema = Schema.Struct({
  search: Schema.String,
})

const SearchSchema = Schema.Struct({
  id: Schema.NullOr(Schema.String),
  title: Schema.NullOr(Schema.String),
  cast: Schema.NullOr(Schema.Array(Schema.String)),
  year: Schema.NullOr(Schema.NumberFromString),
  score: Schema.NullOr(Schema.NumberFromString),
  mediaType: Schema.NullOr(Schema.String),
  poster: Schema.NullOr(Schema.String),
})

const SeasonSchema = Schema.Struct({
  id: Schema.NullOr(Schema.String),
  image: Schema.NullOr(Schema.String),
  title: Schema.NullOr(Schema.String),
  criticsScore: Schema.NullOr(Schema.NumberFromString),
  airDate: Schema.NullOr(Schema.NumberFromString),
  detailsLinkText: Schema.NullOr(Schema.String),
})

const ExtraContentSchema = Schema.Struct({
  synopsis: Schema.NullOr(Schema.String),
  castAndCrew: Schema.NullOr(Schema.Array(Schema.Struct({
    name: Schema.String,
    role: Schema.String,
    poster: Schema.String,
    id: Schema.String,
  }))),
  director: Schema.NullOr(Schema.Array(Schema.String)),
  producer: Schema.NullOr(Schema.Array(Schema.String)),
  seasons: Schema.NullOr(Schema.Array(SeasonSchema)),
  screenwriter: Schema.NullOr(Schema.Array(Schema.String)),
  distributor: Schema.NullOr(Schema.String),
  productionCompanies: Schema.NullOr(Schema.Array(Schema.String)),
  network: Schema.NullOr(Schema.String),
  rating: Schema.NullOr(Schema.String),
  genres: Schema.NullOr(Schema.Array(Schema.String)),
  originalLanguage: Schema.NullOr(Schema.String),
  releaseDateTheaters: Schema.NullOr(Schema.String),
  releaseDateStreaming: Schema.NullOr(Schema.String),
  boxOfficeGross: Schema.NullOr(Schema.String),
  runtime: Schema.NullOr(Schema.String),
  soundMix: Schema.NullOr(Schema.Array(Schema.String)),
  promoEndpoint: Schema.NullOr(Schema.String), // promo video endpoint (m3u8)
})

const TopCriticsSchema = Schema.Struct({
  reviewerId: Schema.NullOr(Schema.String),
  reviewer: Schema.NullOr(Schema.String),
  publication: Schema.NullOr(Schema.String),
  quote: Schema.NullOr(Schema.String),
  originalScore: Schema.NullOr(Schema.String),
  reviewDate: Schema.NullOr(Schema.String),
  reviewLink: Schema.NullOr(Schema.String),
  criticPicture: Schema.NullOr(Schema.String),
})

const CriticReviewSchema = Schema.Struct({
  rating: Schema.NullOr(Schema.String),
  tomatometerScore: Schema.NullOr(Schema.NumberFromString),
  title: Schema.NullOr(Schema.String),
  year: Schema.NullOr(Schema.NumberFromString),
  reviewSnippet: Schema.NullOr(Schema.String),
  publication: Schema.NullOr(Schema.String),
  reviewLink: Schema.NullOr(Schema.String),
  reviewDate: Schema.NullOr(Schema.String),
})

const CriticBioSchema = Schema.Struct({
  name: Schema.NullOr(Schema.String),
  image: Schema.NullOr(Schema.String),
  approvalStatus: Schema.NullOr(Schema.String),
  publications: Schema.NullOr(Schema.Array(Schema.NullOr(Schema.String))),
  criticsGroup: Schema.NullOr(Schema.String),
})

const CriticsSchema = Schema.Struct({
  reviews: Schema.Array(CriticReviewSchema),
  bio: CriticBioSchema,
})

export type HttpClientConfig = Schema.Schema.Type<typeof HttpClientConfigSchema>
export type ResponseType = Schema.Schema.Type<typeof responseTypeSchema>
export type CriticMediaType = Schema.Schema.Type<typeof CriticMediaTypeSchema>
export type SearchURLParams = Schema.Schema.Type<typeof SearchURLParamsSchema>
export type SearchResult = Schema.Schema.Type<typeof SearchSchema>
export type ExtraContent = Schema.Schema.Type<typeof ExtraContentSchema>
export type TopCritics = Schema.Schema.Type<typeof TopCriticsSchema>
export type CriticReview = Schema.Schema.Type<typeof CriticReviewSchema>
export type CriticBio = Schema.Schema.Type<typeof CriticBioSchema>
export type Critic = Schema.Schema.Type<typeof CriticsSchema>
