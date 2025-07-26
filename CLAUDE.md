# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the `rsl-ref-peek` project - a React component library for creating hover-based reference data display components built on shadcn/ui. The project is currently in the planning/design phase with only documentation files present.

## Project Purpose

The main goal is to create a `ReferencedData` component that:
- Provides hover behavior for displaying reference data previews
- Uses shadcn/ui as the foundation (HoverCard, Slot, Skeleton, Button, etc.)
- Supports slot-based composition with `asChild` pattern
- Delegates data fetching to external components rather than handling it internally
- Provides callbacks for data resolution lifecycle events

## Key Architecture Principles

Based on the design documents:

1. **External Data Resolution**: The component does NOT fetch data itself - it accepts a `component` prop that handles data fetching
2. **shadcn/ui Foundation**: All UI components must use shadcn/ui primitives
3. **Slot Pattern**: Supports `asChild` for flexible composition
4. **TypeScript Generics**: Uses `ReferencedDataComponent<T>` for type-safe data binding
5. **Callback Lifecycle**: Supports `onResolved`, `onError`, `onLoading` callbacks

## Component API (Planned)

The main `ReferencedData` component should accept:
- `dataId`: string - Reference identifier
- `type?`: string - Optional data type
- `asChild?`: boolean - Slot composition support
- `delay?`: number - HoverCard display delay
- `linkUrl?`: string - Optional navigation link in hover content
- `component`: ReferencedDataComponent<T> - External component for data fetching/display
- `onResolved?`, `onError?`, `onLoading?`: Lifecycle callbacks

## Commands

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript type checking

### Testing
- `npm run test` - Run tests with Vitest
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting


## Implementation Status

✅ **Project setup complete** - ViteJS, TypeScript, Tailwind CSS, shadcn/ui configured
✅ **Core component implemented** - `ReferencedData` component with all design requirements
✅ **Example implementation** - User preview component demonstrating external data fetching

## Current Architecture

- **Core Component**: `src/components/referenced-data.tsx` - Main ReferencedData component
- **Type Definitions**: `src/types/component.ts` - TypeScript interfaces
- **Examples**: `examples/basic/user-preview.tsx` - Example external data component
- **Utilities**: `src/lib/utils.ts` - Shared utility functions (cn helper)

## Development Environment

- **Framework**: React 18 + TypeScript + ViteJS
- **Styling**: TailwindCSS + shadcn/ui components
- **Build**: Vite with library mode for NPM distribution
- **Testing**: Vitest + Testing Library