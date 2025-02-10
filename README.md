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
// Lists a property with details like price, location etc
list_property(property: Property) -> felt252 
// Input: Property struct with details
// Output: property_id (felt252)

// Gets all visit requests for a property
read_visit_requests(property_id: felt252) -> Array<UserVisitRequest>
// Input: property_id
// Output: Array of visit requests

// Gets investors for property
get_investors_for_investment(investment_id: felt252) -> Array<ContractAddress>
// Input: investment_id
// Output: Array of investor addresses

// Gets investor's balance
get_investor_balance_in_investment(investment_id: felt252, investor_address: ContractAddress) -> u256
// Input: investment_id, investor address
// Output: Balance amount (u256)

// Gets investment manager address
get_investment_manager(investment_id: felt252) -> ContractAddress
// Input: investment_id
// Output: Manager address

// Gets property details
get_property(property_id: felt252) -> Property
// Input: property_id 
// Output: Property struct

// Gets all properties for sale
get_sale_properties() -> Array<Property>
// Output: Array of Property structs

// Gets properties by agent
get_sale_properties_by_agent(agent_id: ContractAddress) -> Array<Property>
// Input: agent address
// Output: Array of Property structs

// Gets all investment properties  
get_investment_properties() -> Array<InvestmentAsset>
// Output: Array of InvestmentAsset structs

// Gets investment details
get_investment(investment_id: felt252) -> InvestmentAsset
// Input: investment_id
// Output: InvestmentAsset struct

// Gets investor returns
read_investor_returns(investment_id: felt252, investor: ContractAddress) -> u256
// Input: investment_id, investor address
// Output: Returns amount (u256)

// Gets latest update timestamp
read_update() -> u256
// Output: Timestamp (u256)

// Gets contract version
version() -> u64
// Output: Version number (u64)

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