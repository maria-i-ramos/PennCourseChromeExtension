# Penn Course Search Extension
<div align="center">
  <img src="https://github.com/maria-i-ramos/PennCourseChromeExtension/blob/19b7e810abe563aeff1a770834ad03e9737bb3ba/src/assets/PCSPLogo.png?raw=true" alt="BiggerLoggoNoBackground" width="300"/>
</div>Penn Course Search Plus is a Chrome extension forked from Penn Course Search that allows students to search for courses in the Penn catalog from the comfort of their Chrome toolbar. Our Chrome extension eliminates the need for students to open extra tabs to gather information about a course. Everything they need is conveniently accessible through the pop-up interface and integration with ChatGPT allows for quick no-tab-changing answers.

To learn more, please visit our [landing page](https://chaelseypark.github.io/PennCourseSearchPlus/)!

## Authors
- Chaesley Park,
- Claire Zhao,
- Maria Ramos,
- Ioannis Kalaitzidis

  
Forked from:
- Franci Branda-Chen,
- Eshaan Chichula,
- Matt Fu,
- Jake G. Murphy

# How To Use The Penn Course Chrome Extension

This comprehensive guide walks you through every feature of the Penn Course Chrome Extension—from basic course search functionality to advanced AI-powered course analysis and comparison.

---

## 📚 Table of Contents
1. [Installation and Setup](#installation-and-setup)
2. [Finding Course Information](#finding-course-information)
    - [Quick Highlight Search](#quick-highlight-search)
    - [Search Tab](#search-tab)
3. [Course Selection Management](#course-selection-management)
    - [Currently Selected Courses](#currently-selected-courses)
    - [Previously Selected Courses](#previously-selected-courses)
4. [AI-Powered Course Analysis](#ai-powered-course-analysis)
    - [Setting Up Your OpenAI API Key](#setting-up-your-openai-api-key)
    - [Quick Course Recommendation](#quick-course-recommendation)
    - [Detailed Course Summary](#detailed-course-summary)
    - [Multi-Course Comparison](#multi-course-comparison)
5. [Understanding Course Data](#understanding-course-data)
    - [Rating Metrics Explained](#rating-metrics-explained)
    - [Historical Data and Trends](#historical-data-and-trends)
6. [Tips and Best Practices](#tips-and-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 🛠 Installation and Setup
Download the latest release from [Releases](https://github.com/fbc101/PennCourseChromeExtension/releases), and unzip the folder.

Now, open a google chrome tab and follow these steps:

1. Click the extension button
![pcs1](https://github.com/fbc101/PennCourseChromeExtension/assets/157915007/9be2a08d-ed4d-4f70-8364-0bb6bfe740b0)

2. Click manage extension
![pcs2](https://github.com/fbc101/PennCourseChromeExtension/assets/157915007/f4f6883b-ffd0-45d5-9f35-c689b084dabf)

3. Enable Developer Mode on the top right and click the `load unpacked` button
![pcs3](https://github.com/fbc101/PennCourseChromeExtension/assets/157915007/06f45074-c918-4cb5-bc27-126f2c04f9f3)

4. Select the unzipped folder created

5. Pin the extension for more convenience!
![pcs6](https://github.com/fbc101/PennCourseChromeExtension/assets/157915007/766fc32c-0ba6-4972-9978-a60e5040977b)


---

## 🔍 Finding Course Information

### 🔦 Quick Highlight Search

1. Highlight any course ID (e.g., `CIS 1200`) on a webpage.
2. Click the extension icon in your toolbar.
3. The course will automatically load in the popup with ratings and a description.

> 💡 If multiple course IDs are highlighted, the first valid one is selected.


![DemoQuickFetch](https://github.com/fbc101/PennCourseChromeExtension/assets/157915007/6da5e2da-2a58-4f60-b61a-e23228f950e3)

### 🔎 Search Tab

1. Open the extension popup.
2. Type a course ID (e.g., `MATH 114`) in the search bar.
3. Press `Enter` or click `Search` to fetch results.

> 💡 Not case-sensitive. `cis 1600` works just as well as `CIS 1600`.

![searchtab](https://github.com/fbc101/PennCourseChromeExtension/assets/157915007/bf58c519-0f86-455b-a317-15a5a161299b)

---

## ✅ Course Selection Management

Use checkboxes to build a list of courses you're exploring.

### 📌 Currently Selected Courses

- Found via search or highlight.
- Check the box to add to "Currently Selected."
- Uncheck to remove.
- Use for courses you're actively considering this semester.

### 📁 Previously Selected Courses

- Click "Move to Previously Selected" to save a course for later.
- View and manage past selections.
- Check the boxes here to include these courses in GPT analysis.

> 💡 Perfect for tracking SSHs, backups, or future semester ideas.

---

## 🤖 AI-Powered Course Analysis

### 🔐 Setting Up Your OpenAI API Key

1. Scroll to the bottom of the popup.
2. Enter your OpenAI API key.
3. Click “Save Key.”

> 🔒 Your key is stored **locally** and never sent elsewhere.

---

### 🧠 Quick Course Recommendation

- Check **1 or more courses** across either section.
- Click **"Ask ChatGPT: Which course should I take?"**
- GPT recommends one based on quality, difficulty, etc.

> 🧠 Best used for 2–5 options you're deciding between.

---

### 📝 Detailed Course Summary

- Check **exactly 1 course**.
- Click **"Ask ChatGPT: Summarize Course."**
- GPT provides an organized, structured breakdown.

> 🎯 Ideal for understanding what to expect before committing.

---

### 📊 Multi-Course Comparison

- Check **2 or more courses**.
- Click **"Ask ChatGPT: Compare Courses."**
- GPT gives pros/cons and which is best for different profiles.

---

## 📈 Understanding Course Data

### 📊 Rating Metrics Explained

Each course shows:
- **Course Quality** – how good the course is overall
- **Instructor Quality** – how well it’s taught
- **Difficulty** – how hard the material/tests are
- **Work Required** – time commitment per week

> 📘 Use these together to balance workload and value.

---

### 🕰 Historical Data and Trends

- Expand course views to see semester-by-semester trends.
- Identify courses that are improving or declining.
- Factor in instructor changes.

---

## 💡 Tips and Best Practices

- Use all 3 GPT tools to support different decisions.
- Keep backup courses in "Previously Selected" in case of full sections.
- Watch for GPT tips about discussion-based vs. heavy-lecture formats.
- Trust the ratings, but also consider your strengths.

---

## 🛠 Troubleshooting

### ❓ No course data?
- Double-check formatting: `CIS-1200`, not `cis120`.
- Not all new courses have ratings yet.

### ❓ GPT not working?
- Ensure your API key is saved and valid.
- Check your OpenAI usage limits.

### ❓ Extension unresponsive?
- Try restarting the extension.
- Make sure only 1 tab is actively using the extension.

---

Let us know if you have suggestions, find bugs, or want to contribute!


### API 
- https://penncoursereview.com/api/documentation/ : This extension is possible thanks to PennLabs
## License 

MIT License

Copyright (c) 2024 Franci Branda-Chen, Eshaan Chichula, Matt Fu, Jake G. Murphy
2025 Chaesley Park, Claire Zhao, Maria Ramos, Ioannis Kalaitzidis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.





