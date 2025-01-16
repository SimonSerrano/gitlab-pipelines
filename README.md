<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]




<!-- PROJECT LOGO -->
<br />
<div align="center">
<h3 align="center">Gitlab CI Pipeline Dashboard</h3>

  <p align="center">
    A dynamic Gitlab CI pipeline dashboard
    <br />
    <a href="https://github.com/SimonSerrano/gitlab-pipelines"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/SimonSerrano/gitlab-pipelines/issues">Report Bug</a>
    ·
    <a href="https://github.com/SimonSerrano/gitlab-pipelines/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/SimonSerrano/gitlab-pipelines)

I created this Gitlab CI pipeline dashboard to monitor the pipelines on a TV or computer screen. This dashboard helps to overview your projects in a glimpse, here's why:
- You can monitor the activity of your projects
- You can check for latest releases
- Pipelines pending, running, failed or manual are highlighted
- Access a project, a pipeline or even a job from the dashboard
- Check for test coverage of your projects after a pipeline succeeds
- Successful pipelines remain highlighted for 15 minutes
- Works with Gitlab's self-managed community edition

Of course, this dashboard may not suit your needs if you itend to monitor a lot of projects, but it will be very useful for smaller teams with a few active projects. You may also suggest changes by forking this repo and creating a pull request or opening an issue.

> This project has been developed for an enterprise use on my spare time and automating tests is not properly done yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Express][Express.js]][Express-url]
* [![React][React.js]][React-url]
* [![Mui][Mui]][Mui-url]
* [![Gitbeaker][Gitbeaker]][Gitbeaker-url]
* [![Typescript][Typescript]][Typescript-url]
* [![NPM][NPM]][Npm-url]
* [![Lerna][Lerna]][Lerna-url]
* [![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* NodeJS
  [Install NodeJS][NodeJS-install-url]

* docker  
  [Install Docker Engine][Docker-install-url]

### Installation

1. [Configure Gitlab as an OAuth 2.0 authentication identity provider](https://docs.gitlab.com/ee/integration/oauth_provider.html)

    This dashboard needs at least the following scopes:
    - read_repository

    > If you want to run this project locally, also add `http://localhost:3000/oauth/redirect` to the redirect URIs
2. Clone the repo
   ```sh
   git clone https://github.com/SimonSerrano/gitlab-pipelines.git
   ```
3. Install NPM packages
   ```sh
   npm install
   npm run bootstrap
   ```
4. Enter your domain and APP ID in `.env` in `packages/backend`
   ```
   GITLAB_DOMAIN=yourdomain.com
   GITLAB_APP_ID=Your app Id
   ```
5. Build Docker images
   ```
   npm run docker:build
   ```
6. Start Docker images
   ```
   npm run docker:start
   ```
7. (Optional) If you want to host this dashboard behind Gitlab's Nginx, add this to your `gitlab.rb`
   ```
   nginx['custom_gitlab_server_config'] = "location /pipelines {\n  proxy_cache off;\n  proxy_pass http://localhost:3000;    \n}\n"
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Simon Serrano - [LinkedIn][linkedin-url]
 - simon.serrano@hotmail.fr

Project Link: [https://github.com/SimonSerrano/gitlab-pipelines](https://github.com/SimonSerrano/gitlab-pipelines)

<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/SimonSerrano/gitlab-pipelines.svg?style=for-the-badge
[contributors-url]: https://github.com/SimonSerrano/gitlab-pipelines/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/SimonSerrano/gitlab-pipelines.svg?style=for-the-badge
[forks-url]: https://github.com/SimonSerrano/gitlab-pipelines/network/members
[stars-shield]: https://img.shields.io/github/stars/SimonSerrano/gitlab-pipelines.svg?style=for-the-badge
[stars-url]: https://github.com/SimonSerrano/gitlab-pipelines/stargazers
[issues-shield]: https://img.shields.io/github/issues/SimonSerrano/gitlab-pipelines.svg?style=for-the-badge
[issues-url]: https://github.com/SimonSerrano/gitlab-pipelines/issues
[license-shield]: https://img.shields.io/github/license/SimonSerrano/gitlab-pipelines.svg?style=for-the-badge
[license-url]: https://github.com/SimonSerrano/gitlab-pipelines/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/simon-serrano
[product-screenshot]: images/screenshot.png
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Mui]: https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white
[Mui-url]: https://mui.com/
[Gitbeaker]: https://img.shields.io/badge/gitbeaker-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[Gitbeaker-url]: https://github.com/jdalrymple/gitbeaker
[Typescript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[NPM]: https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[Npm-url]: https://www.npmjs.com/
[Lerna]: https://img.shields.io/badge/Lerna-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white
[Lerna-url]: https://github.com/lerna/lerna
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Docker-install-url]: https://docs.docker.com/engine/install/
[NodeJS-install-url]: https://nodejs.org/en/learn/getting-started/how-to-install-nodejs
