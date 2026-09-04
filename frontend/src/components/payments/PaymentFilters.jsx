import { Search } from 'lucide-react';

export function PaymentFilters({
  searchQuery,
  onSearchChange,
  resolutionFilter,
  onResolutionChange,
  scenarioFilter,
  onScenarioChange,
  scenarios = [],
  sortBy,
  onSortChange,
  customerStatusFilter,
  onCustomerStatusChange,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.875rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Search Bar */}
      <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
        <div className="search-input-wrapper">
          <Search size={16} className="search-input-icon" />
          <input
            type="text"
            className="input-field search-input-field"
            placeholder="Search by Payment ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Resolution Filter */}
      <div style={{ flex: '0 1 180px', minWidth: '150px' }}>
        <select
          className="select-field"
          value={resolutionFilter}
          onChange={(e) => onResolutionChange(e.target.value)}
          aria-label="Filter by Resolution"
        >
          <option value="ALL">All Resolutions</option>
          <option value="RECOVERED">Recovered</option>
          <option value="REFUNDED">Refunded</option>
          <option value="ESCALATED">Escalated</option>
          <option value="UNRESOLVED">Unresolved</option>
        </select>
      </div>

      {/* Scenario Filter */}
      <div style={{ flex: '0 1 190px', minWidth: '160px' }}>
        <select
          className="select-field"
          value={scenarioFilter}
          onChange={(e) => onScenarioChange(e.target.value)}
          aria-label="Filter by Scenario"
        >
          <option value="ALL">All Scenarios</option>
          {scenarios.map((sc) => (
            <option key={sc} value={sc}>
              {sc.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Status Filter */}
      {onCustomerStatusChange && (
        <div style={{ flex: '0 1 170px', minWidth: '140px' }}>
          <select
            className="select-field"
            value={customerStatusFilter}
            onChange={(e) => onCustomerStatusChange(e.target.value)}
            aria-label="Filter by Customer Status"
          >
            <option value="ALL">Customer Status</option>
            <option value="DEBITED">Debited</option>
            <option value="NOT_DEBITED">Not Debited</option>
            <option value="UNKNOWN">Unknown</option>
          </select>
        </div>
      )}

      {/* Sort By */}
      <div style={{ flex: '0 1 180px', minWidth: '150px' }}>
        <select
          className="select-field"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort options"
        >
          <option value="newest">Created: Newest</option>
          <option value="oldest">Created: Oldest</option>
          <option value="amount-desc">Amount: High → Low</option>
          <option value="amount-asc">Amount: Low → High</option>
          <option value="id-asc">Payment ID: A → Z</option>
        </select>
      </div>
    </div>
  );
}
