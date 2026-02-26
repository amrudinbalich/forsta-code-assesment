# 📍 Forsta Code Assessment

## 📑 Table of Contents

| Section | Description |
|----------|-------------|
| [Introduction](#introduction) | Developer notes and overall concept |
| [Setup](#setup) | Project installation instructions |
| [Mockup Data](#mockup-data) | API restrictions & local mock solution |
| [HTML Skeleton](#html-skeleton) | Structure and normalization |
| [Page Scripts](#page-scripts) | JavaScript architecture overview |
| [JS Code Architecture](#js-code-architecture) | OOP structure explanation |
| [Mobile View](#mobile-view) | Mobile-first implementation |
| [UI Organization](#organizing-ui) | Styling & layout decisions |
| [Mobile Design](#mobile-design) | Styling & layout decisions |

---

## Introduction

### Developer's Word & Setup

While developing this page, I encountered certain scenarios that required adaptation in order to proceed.  

One of the key adjustments included centering the map (for demo purposes) around a single location. This provides a fixed starting point for services like:

- **Map Zoom**
- **Directions API**
- Location-based calculations

This center point serves as a reference origin for all map-related services.

I placed strong emphasis on implementing all major services and functionalities required for the assignment, ensuring a complete feature set with full responsiveness for end users.

---

## Setup

To set up the project:

1. Pull the repository from my GitHub profile:  
   👉 https://github.com/amrudinbalich/forsta-code-assesment  

2. Provide a valid **Google Maps API key**.

The API key is embedded directly in the URL while loading the **Google Maps API script**.

---

## Mockup Data

⚠️ This is an important step.

While working with API calls during development and testing, after multiple retries and page refreshes, I encountered **API usage restrictions**.

To solve this issue, I introduced a:

```json
mock_locations.json
```

This file serves as single source of truth for the page, and it stores a total amount of 20 rows, that are, by structure very similar/same to the output that API produces.

## Mobile Design

The page contains mobile design.
By the provided mockup, but also from my side I tried to create mobile friendly UI devided into 3 main sections:
1. Navbar 
2. Addresses/Map 
3. Interactive Buttons

After you switch to a higher screens, you will find out that the layout switches to different mode - more classic one.

## Desktop Design

Desktop design shows addresses next to map.
Those 2 are the major sections.

## HTML Skeleton
While building a page, starting form initial skeleton I did several changes, from the first stages including HTML normalization process of placing the **HTML Comments** next to important page assets, to later on removing **page assets** that are not being used.

### Page Scripts

Main running power of page interactivity is based on **ES6+ JavaScript**. The code has gone restructuring at some point of time (followed by repo's **pull request** names) where each refactor step is being described in the commit comment.

#### JS Code Architecture
I placed a storng empasis on **OOP** design in the code, but also classic, more 'relaxed' function-like JS structure can be found (inspect ```scripts/page-scripts``` for ref).

##### Why classes?

I like classes because they enforce single responsiblity per one class. For exmaple **MapScript** class is the one that stores **all** related attributes and methods related to loading the map and interactivity around it.

That being said, every **major** functionality of this puzzle contains its own dedicated class, that is responsible for its dedicated functionality.

This makes code more maintainalbe on a long run, it is more readable also.

In a case that there would be need to extend already existing service(class), by adding new method/attributes to it, it can be done.

In a case that, while 'scanning' someone noticed that it is a bigger feature, there is nothing stopping you from making brand new **service class**.
