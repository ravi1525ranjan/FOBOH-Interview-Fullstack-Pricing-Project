# Pricing Profile Management – FOBOH Take-Home Challenge

This repository contains my implementation of a pricing feature built as part of a FOBOH take-home challenge. The goal of this exercise was not to solve abstract problems, but to simulate real-world product work — designing and building a feature that balances usability, maintainability, and clear technical trade-offs within a limited time window.

The feature focuses on enabling suppliers to create bespoke pricing profiles for their customers by selecting products from their catalogue and applying price adjustments relative to the global wholesale price.

The solution consists of:

A browser-based React application for managing pricing profiles

A Node.js backend that exposes APIs for product retrieval and pricing calculations


# Problem Context

Suppliers on FOBOH often need to tailor pricing for specific customers or customer groups in order to maximise margin and stay competitive. While a global wholesale price exists, not all customers should receive the same pricing.

This feature allows suppliers to:

Create pricing profiles for one, many, or all products

Identify products using search and advanced filtering

Apply fixed, percentage-based, or custom price adjustments

Clearly see how adjusted prices are calculated “based on” the global wholesale price

Fall back to the default price for any products not included in the profile

# Key Functional Areas

   <!-- Product Discovery -->

    Suppliers can identify products for a pricing profile by:

    Searching by Product Title, SKU, or partial/fuzzy matches

    Filtering by Category, Sub-Category, Segment, Brand, and Style (wine-specific)

    The UI makes it explicit which products are included in the pricing profile and which continue to use the default wholesale price.

   <!-- Product Selection -->

    Individual products can be selected or unselected

    Bulk selection is supported (select all / unselect all)

    The pricing profile can target a subset of products or the entire catalogue

   <!-- Pricing Adjustments -->

    Suppliers can apply pricing changes using:

    Fixed dollar adjustments

    Percentage-based adjustments

    Custom price overrides

    Before applying changes, users can preview:

    The original global wholesale price

    The adjustment applied

    The resulting calculated price

    This helps reduce mistakes and builds trust in the pricing logic.

# Technical Approach & Decisions

React was used for the frontend to build a responsive, state-driven UI that cleanly separates concerns (product discovery, selection, pricing logic).

Node.js provides a simple backend API for fetching product data and handling pricing calculations.

The UI focuses on clarity over visual complexity — the intent is to make pricing changes easy to understand and hard to misapply.

Pricing calculations are designed to be deterministic and transparent, mirroring how a real pricing engine would behave.

Given the time constraints, the emphasis was placed on:

Clear data flow

Readable, maintainable code

Sensible component boundaries

Explicit handling of defaults vs overridden pricing


# Trade-offs & Future Improvements

If I were to extend this further, I would:

Add persistence for pricing profiles (e.g. database-backed storage)

Improve fuzzy search with a dedicated search engine or indexing strategy

Introduce validation and conflict handling for overlapping pricing profiles

Add role-based access and audit logs for pricing changes

Expand test coverage, particularly around pricing edge cases

# Final Notes

This project was approached as if it were an internal FOBOH feature rather than a coding test. The structure, documentation, and decisions reflect how I would build and explain a feature when working within a product team.