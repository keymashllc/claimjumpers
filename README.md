# Claimjumpers

A run-based roguelike mining game with a hardcore daily payment curve, fictional metals as primary loot, and persistent Vault + Journal systems.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS** for UI
- **Prisma** + SQLite for persistence
- **NextAuth** (credentials provider) for authentication
- **Zustand** for client state management
- **Server Actions** for data mutations

## Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (sectors and market prices)
# Note: Due to Prisma 7 ESM module compatibility, the seed script may not work
# Sectors are automatically created on first user signup, so seeding is optional
# Market prices can be added via Prisma Studio or will be generated on first use
npm run db:seed
```

3. Create a `.env` file in the root directory (if not already present):
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

### Getting Started

1. **Sign Up**: Create an account with email and password
2. **Start a Run**: Click "Start New Run" to begin a 12-day mining run
3. **Mine**: Each day you have 2 shifts. Each shift mines 3 veins.
   - Choose a biome (Desert, Rift, or Glacier)
   - Choose a depth (1, 2, or 3)
   - Choose a mode (Drill or Blast)
4. **Manage Inventory**: After mining, go to Inventory to:
   - Keep items in stash
   - Melt specimens to units
   - Sell units/specimens for credits
5. **Pay Due**: Each day requires paying a due amount. If you can't pay, the run ends and all stash is confiscated.
6. **Win**: Survive all 12 days and pay all dues to win. Your stash deposits to your Vault.

### Game Mechanics

#### Runs
- **Duration**: 12 in-game days
- **HP**: Start with 10 HP. Mining can cause damage.
- **Repair**: Costs 180 Credits per HP point
- **Hardcore**: If you can't pay the due → run ends, ALL stash confiscated

#### Mining
- **Shifts**: 2 per day, 3 veins per shift (6 veins/day total)
- **Modes**:
  - **Drill**: 15% damage chance (20% at Depth 3)
  - **Blast**: 35% chance 1 damage + 15% chance 2 damage (0-2 total)
- **Drops**: Units bundles or Specimens (collectibles)

#### Specimens
- **Forms**: Ore (4 base), Nugget (6), Coin (7), Bar (8)
- **Grades**: Low (1.0x), High (1.5x), Ultra (2.3x)
- **Melt**: Convert to units based on form × grade multiplier
- **Sell**: Melt then sell at bid price (99% of base)

#### Payment Curve
Day 1: 250 | Day 2: 330 | Day 3: 430 | Day 4: 560 | Day 5: 730
Day 6: 950 | Day 7: 1240 | Day 8: 1620 | Day 9: 2120 | Day 10: 2770
Day 11: 3620 | Day 12: 4740

#### Relics
- **Loan Voucher**: Use if short on payment. Covers shortfall but adds +35% to next day's due.
- **Discovery**: 10% chance per day after mining to find a Relic Cache (pick 1 of 2)

#### Vault & Journal
- **Vault**: Persistent storage for specimens and units from winning runs
- **Journal**: Collection tracking with 12 pages:
  - 6 Metal Pages (one per metal type)
  - 3 Biome Pages (Desert, Rift, Glacier)
  - 3 Form/Grade Pages (Coins, Bars, Ultra)
- Specimens can fill multiple journal slots (more rewarding)

#### Markets
- **Commodity Prices**: Update every 15 minutes with random walk
- **Spread**: 2% total (Bid = 99%, Ask = 101%)
- **Sectors**: Users assigned to sectors (A/B/C) on account creation
- **Specimen Marketplace**: MVP stubbed (coming soon)

## Project Structure

```
mine-like/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   ├── components/         # React components
│   ├── auth/              # Auth pages
│   ├── run/               # Run game pages
│   ├── vault/             # Vault page
│   ├── journal/           # Journal page
│   └── market/            # Market page
├── lib/
│   ├── game/              # Core game logic
│   │   ├── constants.ts   # Game constants
│   │   ├── mining.ts      # Mining mechanics
│   │   ├── market.ts      # Market pricing
│   │   ├── journal.ts     # Journal logic
│   │   └── relics.ts      # Relic system
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   └── store.ts           # Zustand store
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed script
│   └── migrations/        # Database migrations
└── lib/game/__tests__/    # Game logic tests
```

## Testing

Run tests:
```bash
npm test
```

Tests cover:
- Mining mechanics (vein generation, damage calculation)
- Specimen unit calculations
- Payment curve validation
- Loan voucher penalty calculations

## Database

The game uses SQLite for MVP (local development). The schema includes:
- Users, Sectors, Runs, DayStates
- StashItems, Specimens, VaultSpecimens
- VaultBalances, JournalSlots
- MarketPriceSnapshots, SpecimenListings
- OwnedRelics

## Development Notes

- All game logic is deterministic and testable in `/lib/game`
- Server actions handle all data mutations
- Client state (selected biome/depth/mode) uses Zustand
- UI is built with TailwindCSS for a modern, dark theme
- Authentication is handled by NextAuth with credentials provider

## Future Enhancements

- Full specimen marketplace implementation
- Market price charts and history
- More relics beyond Loan Voucher
- Journal completion rewards
- Run history and statistics
- Leaderboards

## License

Private project - All rights reserved
