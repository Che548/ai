﻿
<p align="center">
  <a href="https://discord.gg/NGaa9RPCft">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/110412045/228325485-9d3e618f-a980-44fe-89e9-d6d39164680e.png">
      <img src="https://user-images.githubusercontent.com/110412045/228325485-9d3e618f-a980-44fe-89e9-d6d39164680e.png" height="128">
    </picture>
    <h1 align="center">ChatGPT Clone</h1>
  </a>
</p>

<p align="center">
  <a aria-label="Join the community on Discord" href="https://discord.gg/NGaa9RPCft">
    <img alt="" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=DISCORD&labelColor=000000&logoWidth=20">
  </a>
  <a aria-label="Sponsors" href="#sponsors">
    <img alt="" src="https://img.shields.io/badge/SPONSORS-brightgreen.svg?style=for-the-badge&labelColor=000000&logoWidth=20">
  </a>
</p>

## All AI Conversations under One Roof. ##
  Assistant AIs are the future and OpenAI revolutionized this movement with ChatGPT. While numerous UIs exist, this app commemorates the original styling of ChatGPT, with the ability to integrate any current/future AI models, while integrating and improving upon original client features, such as conversation/message search and prompt templates (currently WIP). Through this clone, you can avoid ChatGPT Plus in favor of free or pay-per-call APIs. I will soon deploy a demo of this app. Feel free to contribute, clone, or fork. Currently dockerized.
  
  ![clone3](https://user-images.githubusercontent.com/110412045/230538752-9b99dc6e-cd02-483a-bff0-6c6e780fa7ae.gif)

# Features

- Response streaming identical to ChatGPT through server-sent events
- UI from original ChatGPT, including Dark mode
- AI model selection (through 3 endpoints: OpenAI API, BingAI, and ChatGPT Browser)
- Create, Save, & Share custom presets for OpenAI and BingAI endpoints - [More info on customization here](https://github.com/danny-avila/chatgpt-clone/releases/tag/v0.3.0)
- Edit and Resubmit messages just like the official site (with conversation branching)
- Search all messages/conversations - [More info here](https://github.com/danny-avila/chatgpt-clone/releases/tag/v0.1.0)
- Integrating plugins soon

##
# Sponsors

  Sponsored by <a href="https://github.com/DavidDev1334"><b>@DavidDev1334</b></a>, <a href="https://github.com/mjtechguy"><b>@mjtechguy</b></a>, <a href="https://github.com/Pharrcyde"><b>@Pharrcyde</b></a>, & <a href="https://github.com/fuegovic"><b>@fuegovic</b></a>

##

<details open>
<summary><strong>2023-05-07</strong></summary>

**Released [v0.4.0](https://github.com/danny-avila/chatgpt-clone/releases/tag/v0.4.0)**, Introducing User/Auth System and OAuth2/Social Login! You can now register and login with an email account or use Google login. Your your previous conversations and presets will migrate to your new profile upon creation. Check out the details in the [User/Auth System](#userauth-system) section of the README.md.
 
⚠️ **IMPORTANT :** You should register and login with a local account (email and password) for the first time sign-up. if you use login for the first time with a social login account (eg. Google, facebook, etc.), the conversations and presets that you created before the user system was implemented will NOT be migrated to that account.

⚠️ **Breaking - new Env Variables :** You will need to add the new env variables from .env.example for the app to work, even if you're not using multiple users for your purposes.

For discussion and suggestion you can join us: **[community discord server](https://discord.gg/NGaa9RPCft)**
</details>

##

# Table of Contents

  **[Getting Started](/documents/install/)**
   - [Docker Install](/documents/install/docker_install.md)
   - [Linux Install](documentats/install/linux_install.md)
   - [Mac Install](documentats/install/mac_install.md)
   - [Windows Install](documentats/install/windows_install.md)

**[General Information](documents/general_info/)**
   - [Project Origin](documentats/general_info/project_origin.md)
   - [Roadmap](documentats/general_info/roadmap.md)
   - [Tech Stack](documents/general_info/tech_stack.md)
   - [Bing Jailbreak Info](documentats/general_info/docs/bing_jailbreak_info.md)
 
 **[Features](documents/)**
   - [User Auth System](documents/features/user_auth_system.md)
   - [Proxy](documents/features/proxy.md)
	- **[Plugins](documents/features/plugins/)**
	   - [Google Search](documents/features/google_search.md)

 **[Cloud Deployment](documents/deployment/)**
 - [Heroku](documents/deployment/heroku.md)

**[Contributions](documents/contributions/)**
 - [Code of Conduct](documents/contributions/code_of_conduct.md)
 - [Contributor Guidelines](documents/contributions/contributor_guidelines.md)
 - [Documentation Guidelines](documents/contributions/contributor_guidelines.md)
 - [Testing](documents/contributions/testing.md)
 - [Pull Request Template](documents/contributions/pull_request_template.md)

**[Report Templates](documents/report_templates)**
 - [Bug Report Template](documents/report_templates/code_of_conduct.md)
 - [Custom Issue Template](documents/report_templates/contributor_guidelines.md)
 - [Feature Request Template](documents/report_templates/contributor_guidelines.md)

## 
  
 - [License](LICENSE.md)
 - [Contributors](CONTRIBUTORS.md)
 - [Changelog](CHANGELOG.md)


## Contributing

Contributions and suggestions bug reports and fixes are welcome!
Please read the according documentation before you do!

For new features, components, or extensions, please open an issue and discuss before sending a PR. 

- Join the [Discord community](https://discord.gg/NGaa9RPCft)

## License
This project is licensed under the MIT License.
##

