# Google Search Console Indexer

## Event Storming
## Todo
- [ ] 00: docs
- [ ] 01: login
  - [ ] service
    - [ ] login
      - [ ] user repo
      - [ ] success
        - [ ] create auth client
      - [ ] fail
        - [ ] create auth url
          - [ ] http server
          - [ ] google api client
        - [ ] create user
- [ ] 02: index
  - [ ] url
    - [ ] host repo
    - [ ] success / fail
  - [ ] bulk url
    - [ ] queue
    - [ ] concurrency
  - [ ] sitemap url
- [ ] 03: controller
- [ ] 04: input validator