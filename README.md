# Starhomes - Real Estate Investment Platform

## Overview

Starhomes is a modern real estate investment platform that combines web3 technology with traditional real estate investments. Built on StarkNet, it enables fractional property ownership and transparent investment management through smart contracts.

## Smart Contract Architecture

The Starhomes smart contract (`StarhomesContract`) is built on StarkNet using Cairo 2.0 and implements the following key features:

### Core Features

1. **Property Listing**
   - Property owners can list their properties with customizable parameters
   - Supports fractional ownership through share-based system
   - Configurable payment tokens (ERC20) for investment

2. **Investment Management**
   - Users can purchase shares in listed properties
   - Automatic payment processing through ERC20 tokens
   - Real-time tracking of available shares

3. **Upgradability**
   - Contract implements OpenZeppelin's upgradeable pattern
   - Allows for future improvements while maintaining data
   - Secure upgrade process controlled by contract owner

### Contract Functions

```cairo
// List a new property for investment
fn list_property(price: u256, total_shares: u256, payment_token: ContractAddress) -> u256

// Invest in an existing property
fn invest_in_property(property_id: u256, shares_to_buy: u256)

// Query property details
fn get_property(property_id: u256) -> Property

// Query investment details
fn get_investment(property_id: u256, investor: ContractAddress) -> Investment

// Upgrade contract implementation
fn upgrade(new_class_hash: ClassHash)
```

## Web Features

- **Property Exploration**: Browse through a curated list of premium real estate investments
- **Investment Management**: Track and manage your property investments
- **Viewing Scheduler**: Book property viewings at your convenience
- **Direct Communication**: Contact property managers and investment advisors
- **Investment Analytics**: View detailed ROI projections and investment metrics
- **Responsive Design**: Fully responsive interface that works on all devices

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Icons**: Lucide React
- **Charts**: Recharts

### Smart Contract
- **Language**: Cairo 2.0
- **Network**: StarkNet
- **Dependencies**: OpenZeppelin Contracts
- **Testing**: Integrated test suite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Scarb (for smart contract development)

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
```

2. Navigate to the project directory:
```sh
cd <YOUR_PROJECT_NAME>
```

3. Install dependencies:
```sh
npm install
```

4. Start the development server:
```sh
npm run dev
```

### Smart Contract Development

1. Navigate to the contract directory:
```sh
cd contracts
```

2. Build the contract:
```sh
scarb build
```

3. Run tests:
```sh
scarb test
```

## Project Structure

```
project/
├── src/              # Frontend application code
│   ├── components/   # React components
│   ├── pages/        # Page components
│   └── providers/    # Context providers
└── contracts/        # Smart contract code
    ├── src/          # Contract source files
    └── tests/        # Contract test files
```

## Contact

For inquiries and support, contact us at:
- Email: brianonchezz@gmail.com

## License

This project is licensed under the MIT License - see the LICENSE file for details.