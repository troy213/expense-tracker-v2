# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.0.0-beta.33](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.32...v1.0.0-beta.33) (2026-06-10)


### Features

* **dashboard:** add quick-actions launcher with Goals, Recurring, and Loans ([8924e9c](https://github.com/troy213/expense-tracker-v2/commit/8924e9cf530741a73ae00f13e32148c0242c496a))
* **goals:** add goal-detail store and route, total-saved widget, a11y sweep ([9621da3](https://github.com/troy213/expense-tracker-v2/commit/9621da3ffcf0a4ec71ad281604bc2214d5b559a0))
* **goals:** add goals savings tracker with spend flow and polish ([b2f25b3](https://github.com/troy213/expense-tracker-v2/commit/b2f25b3235335f6892520c173089300f0ab52037))

## [1.0.0-beta.32](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.31...v1.0.0-beta.32) (2026-06-07)


### Bug Fixes

* prevent ReportDetail header from splitting space with transactions sheet ([8127986](https://github.com/troy213/expense-tracker-v2/commit/81279866dfb5c4df1153abfcd29f06bee847b968))

## [1.0.0-beta.31](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.30...v1.0.0-beta.31) (2026-06-07)


### Features

* **seo:** add meta description and robots.txt ([cff0050](https://github.com/troy213/expense-tracker-v2/commit/cff0050ee037910c3b94ecb29ae17d0f6960ac05))


### Bug Fixes

* **a11y:** name icon-only controls and associate form labels ([6a44c2b](https://github.com/troy213/expense-tracker-v2/commit/6a44c2bed6eb03437cf3395a9a5114ef36c0931f))

## [1.0.0-beta.30](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.29...v1.0.0-beta.30) (2026-06-06)


### Features

* **transaction:** default the new-transaction form to the expense tab ([23e360c](https://github.com/troy213/expense-tracker-v2/commit/23e360c220a11c4ab8b3e7bee3ad426a97ff0587))

## [1.0.0-beta.29](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.28...v1.0.0-beta.29) (2026-06-05)


### Features

* **theme:** add system theme, semantic tokens, and icon unification ([95eae43](https://github.com/troy213/expense-tracker-v2/commit/95eae4374cc0e6ce67cea317372beb7cd3a65b45)), closes [#3a7cb5](https://github.com/troy213/expense-tracker-v2/issues/3a7cb5)

## [1.0.0-beta.28](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.27...v1.0.0-beta.28) (2026-06-02)


### Features

* **app:** gate rendering behind isInitialized with a loading spinner ([58d53b1](https://github.com/troy213/expense-tracker-v2/commit/58d53b1bf7da14559386c44752ca61fc80a78dd4))
* **config:** add isInitialized flag and setInitialized reducer ([b91c127](https://github.com/troy213/expense-tracker-v2/commit/b91c1275d078a8aced5fd63d6937a727f5542fef))
* **init:** await all bootstrap loads before marking initialized ([dd76022](https://github.com/troy213/expense-tracker-v2/commit/dd7602248ec1bcd1922627b9dee9676ef595da75))

## [1.0.0-beta.27](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.26...v1.0.0-beta.27) (2026-06-01)


### Features

* **settings:** change setting page ui ([9da1ac2](https://github.com/troy213/expense-tracker-v2/commit/9da1ac2932cd950ca72aac003266261476304f42))

## [1.0.0-beta.26](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.25...v1.0.0-beta.26) (2026-06-01)


### Features

* redesign Settings page and add collapsible Recent Transactions ([1481d82](https://github.com/troy213/expense-tracker-v2/commit/1481d82f699d12c67e62fe9a3134c5c0232c2b42))

## [1.0.0-beta.25](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.24...v1.0.0-beta.25) (2026-05-31)


### Features

* add loading states and load initial data via thunks ([6a6f976](https://github.com/troy213/expense-tracker-v2/commit/6a6f9764e02d59c3939211da747458d067ba3522))
* **categories:** add isLoading flag via addAsyncThunkCases ([8d3be16](https://github.com/troy213/expense-tracker-v2/commit/8d3be1652f59b56955a1554ad779dd6da472d0b8))
* **report:** add getDBReportData thunk and wire reports page to store ([396cf19](https://github.com/troy213/expense-tracker-v2/commit/396cf195999792188315e6cba15c131efc877984))


### Bug Fixes

* **report:** correct avgSpending and add store async-case helper ([db12779](https://github.com/troy213/expense-tracker-v2/commit/db127794dc59899f0663087a95730cf55a888d90))

## [1.0.0-beta.24](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.23...v1.0.0-beta.24) (2026-05-28)


### Features

* add time-range tab selector to the reports page ([3c3dd12](https://github.com/troy213/expense-tracker-v2/commit/3c3dd12542abad099e3e484f84c74b1286d2fa23))

## [1.0.0-beta.23](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.22...v1.0.0-beta.23) (2026-05-26)


### Features

* add category soft deletion and ordering (DB v2 migration) ([6578426](https://github.com/troy213/expense-tracker-v2/commit/6578426ca27ff91335b04cf5865b8253e9e8e9c2))
* route search submissions to the report detail page ([d7344ac](https://github.com/troy213/expense-tracker-v2/commit/d7344ac36db6d5b49499b4b2359f8f980cab6bb7))

## [1.0.0-beta.22](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.21...v1.0.0-beta.22) (2026-05-24)


### Features

* update report detail page UI ([967d55e](https://github.com/troy213/expense-tracker-v2/commit/967d55ea118a145c3f26dc566c7dd742f84b1fd7))
* update report detail UI ([24e7a60](https://github.com/troy213/expense-tracker-v2/commit/24e7a60a856322d61b003e0e6a3db621d3f6a32b))


### Bug Fixes

* outside click form select and date range modal issue ([f813400](https://github.com/troy213/expense-tracker-v2/commit/f81340078bc1835249e5264739c432df465f70f2))

## [1.0.0-beta.21](https://github.com/troy213/expense-tracker-v2/compare/v1.0.0-beta.20...v1.0.0-beta.21) (2026-05-23)


### Features

* add Month Header on Dashboard ([cd2b743](https://github.com/troy213/expense-tracker-v2/commit/cd2b7439dc0685b29b34138bb43e8337c8c4cced))
* add report detail page with URL-driven transaction filters ([c7646a2](https://github.com/troy213/expense-tracker-v2/commit/c7646a28fc7f2381721757cfaf668faddef54651))
