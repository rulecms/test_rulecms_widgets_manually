# RuleCMS widget tests

Manual Next.js pages that server-render RuleCMS widgets.

The homepage lists scenarios. Each scenario page opens with a collapsed note describing what that page is testing, and the rest of the page is the widget.

Development and Production tokens for this app come from the vishal@rulecms.com account on [rulecms.com](https://rulecms.com), for the team `test_rulecms_widgets_manually`.

## Run locally

Copy `.env.example` to `.env.local` and set the Development token plus each page's Development widget key.

```bash
npm install
npm run dev
```

A local Next.js process uses `RULECMS_DEVELOPMENT_TOKEN` and `RULECMS_WIDGET_KEY_<SLUG>_DEVELOPMENT`.

## Vercel

The app is deployed at [https://test-rulecms-widgets-manually.vercel.app/](https://test-rulecms-widgets-manually.vercel.app/).

Set `RULECMS_PRODUCTION_TOKEN` and `RULECMS_WIDGET_KEY_<SLUG>_PRODUCTION` on the Vercel project. Preview and production deployments both use those Production values.

## Add a page

Append an entry to `lib/scenarios.ts`. The homepage picks it up, and `/scenarios/<slug>` renders it. The note stays collapsed until it is opened.
