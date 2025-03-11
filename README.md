# Torah Schedule Creator

A powerful JavaScript application for creating customized Torah and Mishnah study schedules. This tool allows you to generate personalized learning schedules based on your preferences and export them as CSV or ICS (calendar) files.

## Features

- Create schedules for Tanach (Bible) or Mishnayot (Mishnah)
- Flexible selection options:
  - Complete Tanach or specific sections (Torah, Nevi'im, Ketuvim)
  - Individual books of Tanach
  - Complete Mishnayot or specific Sedarim (Orders)
  - Individual Mishnah tractates
- Two scheduling methods:
  - Set number of chapters per day
  - Set timeframe (start and end dates)
- Choose which days of the week to study
- Export schedules as CSV files or ICS calendar files
- Interactive preview of your schedule

## Usage

1. Open `index.html` in your web browser
2. Select either Tanach or Mishnah tab based on what you want to study
3. Enter a name for your schedule
4. Choose what to study (complete Tanach/Mishnah, specific sections, or individual books/tractates)
5. Select your scheduling method:
   - Chapters per day: specify how many chapters to study each day
   - Timeframe: specify start and end dates
6. Select which days of the week you want to study
7. Click "Generate Schedule"
8. Preview your schedule and download it as CSV or ICS file

## Data Structure

The application includes comprehensive data for:

- All books of Tanach with their Hebrew names and chapter counts
- All tractates of Mishnah organized by Seder (Order) with their Hebrew names and chapter counts

## Technical Details

This application is built with vanilla JavaScript and uses the following libraries:

- Bootstrap 5 for UI components
- Flatpickr for date selection

No server-side components are required - everything runs in the browser.

## Live Demo

You can access the live version of this application on GitHub Pages at [https://matthewjmiller07.github.io/TorahScheduler](https://matthewjmiller07.github.io/TorahScheduler).
