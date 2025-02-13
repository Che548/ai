# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### ✨ New Features

- 🪄 feat: Agent Artifacts by **@danny-avila** in [#5804](https://github.com/danny-avila/LibreChat/pull/5804)

### 🌍 Internationalization

- 🔄 chore: Enforce 18next Language Keys by **@rubentalstra** in [#5803](https://github.com/danny-avila/LibreChat/pull/5803)

### 🔧 Fixes

- 🔄 chore: Enforce 18next Language Keys by **@rubentalstra** in [#5803](https://github.com/danny-avila/LibreChat/pull/5803)

### ⚙️ Other Changes

- 🔄 chore: Enforce 18next Language Keys by **@rubentalstra** in [#5803](https://github.com/danny-avila/LibreChat/pull/5803)
- 🔃 refactor: Parent Message ID Handling on Error, Update Translations, Bump Agents by **@danny-avila** in [#5833](https://github.com/danny-avila/LibreChat/pull/5833)


---

## [v0.7.7-rc1] - 2025-02-11

Changes from v0.7.6 to v0.7.7-rc1.

### ✨ New Features

- 🎨 feat: enhance UI & accessibility in file handling components by **@berry-13** in [#5086](https://github.com/danny-avila/LibreChat/pull/5086)
- 🤖 feat: Support Google Agents, fix Various Provider Configurations by **@danny-avila** in [#5126](https://github.com/danny-avila/LibreChat/pull/5126)
- 🔑 feat: Implement TTL Mgmt. for In-Memory Keyv Stores by **@danny-avila** in [#5127](https://github.com/danny-avila/LibreChat/pull/5127)
- 🎨 feat: enhance Chat Input UI, File Mgmt. UI, Bookmarks a11y by **@berry-13** in [#5112](https://github.com/danny-avila/LibreChat/pull/5112)
- ®️ feat: Support Rscript for Code Interpreter & `recursionLimit` for Agents by **@danny-avila** in [#5170](https://github.com/danny-avila/LibreChat/pull/5170)
- 🔗 feat: Convo Settings via URL Query Params & Mention Models by **@danny-avila** in [#5184](https://github.com/danny-avila/LibreChat/pull/5184)
- ✨ feat: Quality-of-Life Chat/Edit-Message Enhancements by **@danny-avila** in [#5194](https://github.com/danny-avila/LibreChat/pull/5194)
- 💾 feat: Production-ready Memory Store for `express-session` by **@lkiesow** in [#5212](https://github.com/danny-avila/LibreChat/pull/5212)
- 🌤️ feat: Add OpenWeather Tool for Weather Data Retrieval by **@danny-avila** in [#5246](https://github.com/danny-avila/LibreChat/pull/5246)
- 🏃‍♂️‍➡️ feat: Upgrade Meilisearch to v1.12.3 by **@danny-avila** in [#5327](https://github.com/danny-avila/LibreChat/pull/5327)
- 🔥 feat: `deepseek-reasoner` Thought Streaming by **@danny-avila** in [#5379](https://github.com/danny-avila/LibreChat/pull/5379)
- 🔗 feat: Enhance Share Functionality, Optimize DataTable & Fix Critical Bugs by **@berry-13** in [#5220](https://github.com/danny-avila/LibreChat/pull/5220)
- 🚀 feat: Artifact Editing & Downloads by **@danny-avila** in [#5428](https://github.com/danny-avila/LibreChat/pull/5428)
- 🌄 feat: Add RouteErrorBoundary for Improved Client Error handling by **@berry-13** in [#5396](https://github.com/danny-avila/LibreChat/pull/5396)
- 🐳 feat: Deepseek Reasoning UI by **@danny-avila** in [#5440](https://github.com/danny-avila/LibreChat/pull/5440)
- ✨ feat: Add Google Parameters, Ollama/Openrouter Reasoning, & UI Optimizations by **@danny-avila** in [#5456](https://github.com/danny-avila/LibreChat/pull/5456)
- 🚀 feat: o1 Tool Calling & `reasoning_effort` by **@danny-avila** in [#5553](https://github.com/danny-avila/LibreChat/pull/5553)
- ✨ feat: Add Scripts for listing users and resetting passwords by **@jmaddington** in [#5438](https://github.com/danny-avila/LibreChat/pull/5438)
- 👷 feat: Allow Admin to Edit Agent/Assistant Actions by **@owengo** in [#4591](https://github.com/danny-avila/LibreChat/pull/4591)
- 🖱️ feat: Switch Scroll Button setting by **@berry-13** in [#5332](https://github.com/danny-avila/LibreChat/pull/5332)
- 🍎 feat: Apple auth by **@rubentalstra** in [#5473](https://github.com/danny-avila/LibreChat/pull/5473)
- 🤖 feat: o3-mini by **@danny-avila** in [#5581](https://github.com/danny-avila/LibreChat/pull/5581)
- 🎥 feat: YouTube Tool by **@danny-avila** in [#5582](https://github.com/danny-avila/LibreChat/pull/5582)
- ☁️ feat: Additional AI Gateway Provider Support; fix: Reasoning Effort for Presets/Agents by **@danny-avila** in [#5600](https://github.com/danny-avila/LibreChat/pull/5600)
- 🛂 feat: OpenID Logout Redirect to `end_session_endpoint` by **@danny-avila** in [#5626](https://github.com/danny-avila/LibreChat/pull/5626)
- ✨ feat: added Github Enterprise SSO login by **@rubentalstra** in [#5621](https://github.com/danny-avila/LibreChat/pull/5621)
- 💬 feat: Temporary Chats by **@ohneda** in [#5493](https://github.com/danny-avila/LibreChat/pull/5493)
- 📜 feat: Configure JSON Log Truncation Size by **@thelinuxkid** in [#5215](https://github.com/danny-avila/LibreChat/pull/5215)
- 📱 feat: improve mobile viewport behavior with interactive-widget meta by **@ssiegel** in [#5675](https://github.com/danny-avila/LibreChat/pull/5675)
- 🌎 i18n: React-i18next & i18next Integration by **@rubentalstra** in [#5720](https://github.com/danny-avila/LibreChat/pull/5720)
- ✨feat: OAuth for Actions by **@rubentalstra** in [#5693](https://github.com/danny-avila/LibreChat/pull/5693)
- 🔨 feat: Use `x-strict` attribute in OpenAPI Actions for Strict Function Definition by **@owengo** in [#4639](https://github.com/danny-avila/LibreChat/pull/4639)

### 🌍 Internationalization

- 🌍 i18n: Add Missing "Balance" Localization For All Languages by **@TonyMahoney** in [#5594](https://github.com/danny-avila/LibreChat/pull/5594)
- 🌍 i18n: Fix "Balance" Localization For Zh&ZhTraditional by **@RedwindA** in [#5632](https://github.com/danny-avila/LibreChat/pull/5632)
- 🌍 i18n: Fix "Balance" Localization For De by **@leondape** in [#5656](https://github.com/danny-avila/LibreChat/pull/5656)
- 🌍 i18n: "Balance" Localization For ZhTraditional by **@SN-Koarashi** in [#5682](https://github.com/danny-avila/LibreChat/pull/5682)
- 🌎 i18n: React-i18next & i18next Integration by **@rubentalstra** in [#5720](https://github.com/danny-avila/LibreChat/pull/5720)
- 🤖 ci: locize-pull-published-sync-pr.yml by **@rubentalstra** in [#5762](https://github.com/danny-avila/LibreChat/pull/5762)
- 🌍 i18n: Update translation.json with latest translations by **@github-actions[bot]** in [#5764](https://github.com/danny-avila/LibreChat/pull/5764)
- 🌍 i18n: Update translation.json with latest translations by **@github-actions[bot]** in [#5765](https://github.com/danny-avila/LibreChat/pull/5765)
- 🌍 i18n: Update translation.json with latest translations by **@github-actions[bot]** in [#5789](https://github.com/danny-avila/LibreChat/pull/5789)

### 👐 Accessibility

- ♿ fix: Improve Accessibility in Endpoints Menu/Navigation by **@danny-avila** in [#5123](https://github.com/danny-avila/LibreChat/pull/5123)
- 🎨 feat: enhance Chat Input UI, File Mgmt. UI, Bookmarks a11y by **@berry-13** in [#5112](https://github.com/danny-avila/LibreChat/pull/5112)
- ♿️ a11y: Enhance Accessibility in ToolSelectDialog, ThemeSelector and ChatGroupItem by **@berry-13** in [#5395](https://github.com/danny-avila/LibreChat/pull/5395)
- 🔍 a11y: MultiSearch Clear Input by **@danny-avila** in [#5718](https://github.com/danny-avila/LibreChat/pull/5718)
- 🔇 a11y: Silence Unnecessary Icons for Screen Readers by **@kangabell** in [#5726](https://github.com/danny-avila/LibreChat/pull/5726)

### 🔧 Fixes

- 🔒 fix: resolve session persistence post password reset by **@berry-13** in [#5077](https://github.com/danny-avila/LibreChat/pull/5077)
- 🔒 fix: update refresh token handling to use plain token instead of hashed token by **@berry-13** in [#5088](https://github.com/danny-avila/LibreChat/pull/5088)
- ♿ fix: Improve Accessibility in Endpoints Menu/Navigation by **@danny-avila** in [#5123](https://github.com/danny-avila/LibreChat/pull/5123)
- 🐛 fix: Artifacts Type Error, Tool Token Counts, and Agent Chat Import by **@danny-avila** in [#5142](https://github.com/danny-avila/LibreChat/pull/5142)
- 🔧 fix: Handle Concurrent File Mgmt. For Agents by **@thingersoft** in [#5159](https://github.com/danny-avila/LibreChat/pull/5159)
- 🐛 fix: Prevent Default Values in OpenAI/Custom Endpoint Agents by **@danny-avila** in [#5180](https://github.com/danny-avila/LibreChat/pull/5180)
- 🔖 fix: Remove Local State from Bookmark Menu by **@danny-avila** in [#5181](https://github.com/danny-avila/LibreChat/pull/5181)
- 🧵 fix: Prevent Unnecessary Re-renders when Loading Chats by **@danny-avila** in [#5189](https://github.com/danny-avila/LibreChat/pull/5189)
- 🐛 fix: Correct Endpoint/Icon Handling, Update Module Resolutions by **@danny-avila** in [#5205](https://github.com/danny-avila/LibreChat/pull/5205)
- 🐛 fix: Ensure Default ModelSpecs Are Set Correctly by **@danny-avila** in [#5218](https://github.com/danny-avila/LibreChat/pull/5218)
- 🔧 fix: Streamline Builder Links and Enhance UI Consistency by **@danny-avila** in [#5229](https://github.com/danny-avila/LibreChat/pull/5229)
- 🐛 fix: Resolve 'Icon is Not a Function' Error in PresetItems by **@danny-avila** in [#5260](https://github.com/danny-avila/LibreChat/pull/5260)
- 🔧 fix: Maximize Chat Space for Agent Messages by **@berry-13** in [#5330](https://github.com/danny-avila/LibreChat/pull/5330)
- 🎯 fix: Prevent UI De-sync By Removing Redundant States by **@danny-avila** in [#5333](https://github.com/danny-avila/LibreChat/pull/5333)
- 🐛 fix: use OpenID token signature algo as discovered from the server. by **@ragavpr** in [#5348](https://github.com/danny-avila/LibreChat/pull/5348)
- 🔈fix: Accessible name on 'Prev' button in Prompts UI by **@berry-13** in [#5369](https://github.com/danny-avila/LibreChat/pull/5369)
- 🛠️ fix: Optionally add OpenID Sig. Algo. from Server Discovery by **@danny-avila** in [#5398](https://github.com/danny-avila/LibreChat/pull/5398)
- 🪙 fix: Deepseek Pricing & Titling by **@danny-avila** in [#5459](https://github.com/danny-avila/LibreChat/pull/5459)
- 🐛 fix: Update deletePromptController to include user role in query by **@danny-avila** in [#5488](https://github.com/danny-avila/LibreChat/pull/5488)
- 🛡️ fix: enhance email verification process & refactor verifyEmail component by **@berry-13** in [#5485](https://github.com/danny-avila/LibreChat/pull/5485)
- 🉐 fix: incorrect handling for composing CJK texts in Safari by **@oonishi3** in [#5496](https://github.com/danny-avila/LibreChat/pull/5496)
- 🤖 fix: GoogleClient Context Handling & GenAI Parameters by **@danny-avila** in [#5503](https://github.com/danny-avila/LibreChat/pull/5503)
- ♻️ fix: Prevent Instructions from Removal when nearing Max Context by **@danny-avila** in [#5516](https://github.com/danny-avila/LibreChat/pull/5516)
- 🗨️ fix: Loading Shared Saved Prompts by **@jameslamine** in [#5515](https://github.com/danny-avila/LibreChat/pull/5515)
- 🔧 fix: handle known OpenAI errors with empty intermediate reply by **@jameslamine** in [#5562](https://github.com/danny-avila/LibreChat/pull/5562)
- 🔧 fix: Add missing `finish_reason` to stream chunks by **@jameslamine** in [#5563](https://github.com/danny-avila/LibreChat/pull/5563)
- 🤖 fix: Azure Agents after Upstream Breaking Change by **@danny-avila** in [#5571](https://github.com/danny-avila/LibreChat/pull/5571)
- 🐛 fix: Handle content generation errors in GoogleClient by **@danny-avila** in [#5575](https://github.com/danny-avila/LibreChat/pull/5575)
- 🔧 fix: Fetch PWA Manifest with credentials over CORS by **@samvrlewis** in [#5156](https://github.com/danny-avila/LibreChat/pull/5156)
- 🛠️ fix: enhance UI/UX and address a11y issues in SetKeyDialog by **@berry-13** in [#5672](https://github.com/danny-avila/LibreChat/pull/5672)
- 🔧 fix: Wrong import `useGetStartupConfig` by **@rubentalstra** in [#5692](https://github.com/danny-avila/LibreChat/pull/5692)
- 🚀 fix: Resolve Google Client Issues, CDN Screenshots, Update Models by **@danny-avila** in [#5703](https://github.com/danny-avila/LibreChat/pull/5703)
- 💬 fix: Temporary Chat PR's broken components and improved UI by **@berry-13** in [#5705](https://github.com/danny-avila/LibreChat/pull/5705)
- 🧹 chore: Migrate to Flat ESLint Config & Update Prettier Settings by **@rubentalstra** in [#5737](https://github.com/danny-avila/LibreChat/pull/5737)
- 📦 chore: Bump Packages by **@rubentalstra** in [#5791](https://github.com/danny-avila/LibreChat/pull/5791)
- 🧠 fix: Handle Reasoning Chunk Edge Cases by **@danny-avila** in [#5800](https://github.com/danny-avila/LibreChat/pull/5800)

### ⚙️ Other Changes

- 📘 docs: update readme.md by **@berry-13** in [#5065](https://github.com/danny-avila/LibreChat/pull/5065)
- 🐋 refactor: Reduce Dockerfile.multi container size by **@alex-torregrosa** in [#5066](https://github.com/danny-avila/LibreChat/pull/5066)
- 🧾 docs: Update Example `librechat.yaml` by **@fcnjd** in [#5165](https://github.com/danny-avila/LibreChat/pull/5165)
- 🔄 refactor: Consolidate Tokenizer; Fix Jest Open Handles by **@danny-avila** in [#5175](https://github.com/danny-avila/LibreChat/pull/5175)
- ⚡️ refactor: Optimize Rendering Performance for Icons, Conversations by **@danny-avila** in [#5234](https://github.com/danny-avila/LibreChat/pull/5234)
- ♻️ refactor: Logout UX, Improved State Teardown, & Remove Unused Code by **@danny-avila** in [#5292](https://github.com/danny-avila/LibreChat/pull/5292)
- 🔧 refactor: Improve Agent Context & Minor Fixes by **@danny-avila** in [#5349](https://github.com/danny-avila/LibreChat/pull/5349)
- 🔧 chore: bump `mongoose` to patch CVE-2025-23061 by **@danny-avila** in [#5351](https://github.com/danny-avila/LibreChat/pull/5351)
- 📜 refactor: Log Error Messages when OAuth Fails by **@ragavpr** in [#5337](https://github.com/danny-avila/LibreChat/pull/5337)
- 🔒 chore: bump `katex` package to patch CVE-2025-23207 by **@danny-avila** in [#5383](https://github.com/danny-avila/LibreChat/pull/5383)
- 🔧 chore: Update Deepseek Pricing, Google Safety Settings by **@danny-avila** in [#5409](https://github.com/danny-avila/LibreChat/pull/5409)
- 🔧 chore: bump ```vite``` to patch CVE-2025-24010 by **@rubentalstra** in [#5495](https://github.com/danny-avila/LibreChat/pull/5495)
- 🏄‍♂️ refactor: Optimize Reasoning UI & Token Streaming by **@danny-avila** in [#5546](https://github.com/danny-avila/LibreChat/pull/5546)
- 🧹 chore: Remove Deprecated BingAI Code & Address Mobile Focus by **@danny-avila** in [#5565](https://github.com/danny-avila/LibreChat/pull/5565)
- 📝 docs: Update `librechat.example.yaml` by **@fuegovic** in [#5544](https://github.com/danny-avila/LibreChat/pull/5544)
- 🛜 ci: OpenID Strategy Test Async Handling by **@rubentalstra** in [#5613](https://github.com/danny-avila/LibreChat/pull/5613)
- 🔧 refactor: Revamp Model and Tool Filtering Logic by **@danny-avila** in [#5637](https://github.com/danny-avila/LibreChat/pull/5637)
- 🤖 refactor: Prevent Vertex AI from Setting Parameter Defaults by **@danny-avila** in [#5653](https://github.com/danny-avila/LibreChat/pull/5653)
- 🎨 style: Prompt UI Refresh & A11Y Improvements by **@berry-13** in [#5614](https://github.com/danny-avila/LibreChat/pull/5614)
- 🧹 chore: Enhance Issue Templates with Emoji Labels by **@rubentalstra** in [#5754](https://github.com/danny-avila/LibreChat/pull/5754)
- 🧹 chore: Migrate to Flat ESLint Config & Update Prettier Settings by **@rubentalstra** in [#5737](https://github.com/danny-avila/LibreChat/pull/5737)
- 🤖 ci: locize-pull-published-sync-pr.yml by **@rubentalstra** in [#5762](https://github.com/danny-avila/LibreChat/pull/5762)
- 🤖 ci: locize-pull-published-sync-pr.yml  by **@rubentalstra** in [#5763](https://github.com/danny-avila/LibreChat/pull/5763)
- 📝 docs: Update Language Request Template & Update README by **@berry-13** in [#5766](https://github.com/danny-avila/LibreChat/pull/5766)
- 📜 ci: Consolidate Locize Workflows for Missing Keys & PR Creation by **@rubentalstra** in [#5769](https://github.com/danny-avila/LibreChat/pull/5769)
- 🎯 ci: Update ESLint Workflow to target `api/` and `client/` changes by **@rubentalstra** in [#5771](https://github.com/danny-avila/LibreChat/pull/5771)
- 🛠️ ci: Add Workflow to Detect Unused i18next Keys in PRs by **@rubentalstra** in [#5782](https://github.com/danny-avila/LibreChat/pull/5782)
- 🔄 chore: Refactor Locize Workflow for Improved Translation Sync by **@rubentalstra** in [#5781](https://github.com/danny-avila/LibreChat/pull/5781)
- 📦 chore: Bump Packages by **@rubentalstra** in [#5791](https://github.com/danny-avila/LibreChat/pull/5791)


[See full release details][release-v0.7.7-rc1]

[release-v0.7.7-rc1]: https://github.com/danny-avila/LibreChat/releases/tag/v0.7.7-rc1
