<div align="center">
  <a href="https://jay-patel1337-six.vercel.app/play"><img src="assets/title-screen.svg" width="100%" alt="JAY PATEL. Computer Engineering · Silver Oak University. “I'll wait where the stars forget to shine.” Press start: click to play Hollow Rush."></a>
  <img src="assets/hud.svg" width="100%" alt="Live GitHub stats: contributions this year, current streak, best streak, stars and public repos">
</div>

<img src="assets/divider-player.svg" width="100%" alt="World 1: Player select">
<img src="assets/player-card.svg" width="100%" alt="Player card. Class: Computer Engineering. Guild: Silver Oak University. Learning by building; C/C++ at heart, web on the side. Current quest: master data structures and algorithms.">

```cpp
// about_me.cpp  (it compiles: g++ -std=c++17 about_me.cpp)
#include <iostream>
#include <string>
#include <vector>

enum Month { Jan = 1, Feb, March, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec };

struct Birthday {
  int day;
  Month month;
};

class JayPatel {
 public:
  std::string role  = "Computer Engineering @ Silver Oak University";
  std::string motto = "I'll wait where the stars forget to shine.";

  std::vector<std::string> languages = {"C", "C++", "Python", "HTML", "CSS"};
  std::vector<std::string> tools     = {"Git", "GitHub", "VS Code", "Flask"};

  std::string currentQuest = "Data Structures & Algorithms";
  std::string sideQuest    = "Ship more web apps";

  std::vector<std::string> watchlist = {"Bleach", "Another", "Erased"};
  Birthday birthday{0b1101, March};  // wish me on this day ;)

  void greet() const {
    std::cout << "Hello, World! Thanks for dropping by.\n";
  }
};

int main() {
  JayPatel().greet();
}
```

<img src="assets/divider-gear.svg" width="100%" alt="World 2: Gear and skills">
<img src="assets/inventory.svg" width="100%" alt="Inventory: C, C++, Python, HTML, CSS, Flask, Git, GitHub, VS Code, and one secret item">
<img src="assets/lang-xp.svg" width="100%" alt="Language XP measured across my public repositories">
<img src="assets/skill-tree.svg" width="100%" alt="Skill tree. Unlocked: C, Python, HTML, C++, pointers, Flask, CSS, OOP, backtracking. In progress: DSA. Locked: SQL, JavaScript, STL, competitive programming, React.">

<img src="assets/divider-levels.svg" width="100%" alt="World 3: Level select">
<p align="center">
  <a href="https://github.com/jay-patel1337/C_self"><img src="assets/level-c_self.svg" width="49%" alt="World 1-1, C_self: self-taught C with 11 chapters, problem sets, logic drills and DS lab work"></a>
  <a href="https://github.com/jay-patel1337/CPP_self"><img src="assets/level-cpp_self.svg" width="49%" alt="World 1-2, CPP_self: C++ basics, OOP and experiments"></a>
  <a href="https://github.com/jay-patel1337/codealpha_tasks"><img src="assets/level-codealpha_tasks.svg" width="49%" alt="World 1-3 boss, codealpha_tasks: CodeAlpha C++ internship with a CGPA calculator, login system, Sudoku solver and bank system"></a>
  <a href="https://github.com/jay-patel1337/FoodiePieUp"><img src="assets/level-foodiepieup.svg" width="49%" alt="World 2-1, FoodiePieUp: Flask nutrition tracker with a meal planner, calorie and macro calculator and a water log"></a>
</p>

<img src="assets/divider-trophies.svg" width="100%" alt="World 4: Trophy room">
<img src="assets/achievements.svg" width="100%" alt="Achievements, some unlocked automatically from live GitHub stats">

<img src="assets/divider-save.svg" width="100%" alt="World 5: Save point">
<img src="assets/dialogue.svg" width="100%" alt="Anime quote of the day from Bleach, Another or Erased">
<a href="https://jay-patel1337-six.vercel.app/api/now-playing?open"><img src="https://jay-patel1337-six.vercel.app/api/now-playing" width="100%" alt="What I'm listening to on Spotify right now"></a>

<img src="assets/divider-bonus.svg" width="100%" alt="Bonus stage: Hollow Rush">
<a href="https://jay-patel1337-six.vercel.app/play"><img src="assets/play-card.svg" width="100%" alt="Hollow Rush: a playable retro runner. Click to play in your browser."></a>
<a href="https://jay-patel1337-six.vercel.app/play"><img src="https://jay-patel1337-six.vercel.app/api/scores?format=svg" width="100%" alt="Hollow Rush hall of fame: the top 5 scores, updated live"></a>

<img src="assets/divider-boss.svg" width="100%" alt="Final world: Boss fight">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jay-patel1337/jay-patel1337/output/snake-dark.svg">
  <img src="https://raw.githubusercontent.com/jay-patel1337/jay-patel1337/output/snake-light.svg" width="100%" alt="A snake eating my contribution graph">
</picture>

<details>
<summary><b>📜 LORE: anime ball knowledge (spoiler-free)</b></summary>
<br>

**⚔️ BLEACH**
- 366 episodes from 2004 to 2012 by Studio Pierrot, then back from the dead with *Thousand-Year Blood War* in 2022.
- The very first opening, "\*\~Asterisk\~", is by ORANGE RANGE.
- Shirō Sagisu (yes, the *Evangelion* composer) scored it. By his own account, "Number One" became the face of Bleach.
- Aizen's Kyōka Suigetsu puts anyone who has seen its release under complete hypnosis. That is where the meme comes from.

**⏳ ERASED**
- The Japanese title, *Boku dake ga Inai Machi*, means "The Town Where Only I Am Missing".
- Satoru is a 29-year-old manga artist delivering pizza, and his "Revival" throws him back to 1988.
- The opening "Re:Re:" by ASIAN KUNG-FU GENERATION first came out in 2004 on *Sol-fa*, and was re-recorded for the anime in 2016.

**👁️ ANOTHER**
- A 2012 P.A. Works anime based on Yukito Ayatsuji's novel.
- Set in 1998 in class 3-3 of Yomiyama North Middle School, where one rule matters: pretend one classmate doesn't exist.
- Its only opening is "Kyōmu Densen" (*Nightmare Contagion*) by ALI PROJECT.

**🧪 Parody corner** (not real quotes)
> *"Since when were you under the impression that my code had no bugs?"*: Aizen, reviewing my PR
>
> *"Bankai: `git push --force`"*
>
> Revival: when <kbd>Ctrl</kbd>+<kbd>Z</kbd> works on real life.
>
> Class 3-3 rule: pretend one compiler warning doesn't exist.
>
> Kayo, reading my first C program: *"Are you stupid?"*

</details>

<details>
<summary><b>🛠️ UNDER THE HOOD: how this profile is built</b></summary>
<br>

No templates or card services. Everything here is generated by code in this repo:

- **Pixel font engine**: a hand-made 5×7 bitmap font ([`scripts/lib/pixel-font.js`](scripts/lib/pixel-font.js)) turns text into SVG paths, so it stays crisp without web fonts (GitHub won't let SVGs load them).
- **Renderer**: [`scripts/render.js`](scripts/render.js) draws every panel, sprite and animation as SVG. Animations are CSS keyframes with `steps()` timing for that choppy 8-bit feel, and each one falls back to its final frame under `prefers-reduced-motion`.
- **Single config**: all of the content lives in [`profile.config.js`](profile.config.js). Running `npm run assets` rebuilds everything, with zero dependencies.
- **Live data**: a [GitHub Action](.github/workflows/daily.yml) runs every 6 hours. It pulls stats through the GraphQL API, recomputes the HUD, language XP, streaks and trophy unlocks, rotates the quote of the day, and regenerates the snake.
- **Hollow Rush** ([play it](https://jay-patel1337-six.vercel.app/play) · [`play/`](play/)): a canvas game at 320×180 with fixed-timestep physics, a double-jump "Shunpo", procedurally generated Karakura rooftops, Hollows with simple AI, combos, a Hollow-mask power-up, hit-stop and screen shake. Its chiptune music and sound effects are synthesized live with WebAudio. The hero is composed from layered sprite parts ([`scripts/lib/ichigo.js`](scripts/lib/ichigo.js)), and the same frames animate this README.
- **Now playing**: a Vercel serverless function ([`api/now-playing.js`](api/now-playing.js)) asks the Spotify Web API what's playing and draws it in the same pixel style, with a pixelated album cover inlined as base64.

</details>

<img src="assets/divider-continue.svg" width="100%" alt="Continue?">
<p align="center">
  <a href="https://www.linkedin.com/in/jay-patel-027200377"><img src="assets/btn-linkedin.svg" width="32%" alt="LinkedIn"></a>
  <a href="https://www.instagram.com/jayx_xpatel"><img src="assets/btn-instagram.svg" width="32%" alt="Instagram @jayx_xpatel"></a>
  <a href="mailto:jaypatel2007.bp@gmail.com"><img src="assets/btn-email.svg" width="32%" alt="Email jaypatel2007.bp@gmail.com"></a>
</p>

<img src="assets/game-over.svg" width="100%" alt="Thanks for playing! Hit follow to save your progress.">

<p align="center">
  <a href="https://github.com/jay-patel1337/jay-patel1337/actions/workflows/daily.yml"><img src="https://github.com/jay-patel1337/jay-patel1337/actions/workflows/daily.yml/badge.svg" alt="daily build status"></a>
</p>
