import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faMagnifyingGlass,
  faCheck,
  faBuildingColumns,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { BottomSheet } from '@common/BottomSheet';
import { Input } from '@/components/ui/input';
import { type Campus, defaultCampuses } from '@/types/campus';

interface CampusPickerSheetProps {
  open: boolean;
  onClose: () => void;
  selectedCampus: Campus;
  onSelectCampus: (campus: Campus) => void;
  campuses?: Campus[];
}

export function CampusPickerSheet({
  open,
  onClose,
  selectedCampus,
  onSelectCampus,
  campuses = defaultCampuses
}: CampusPickerSheetProps) {
  const [search, setSearch] = useState('');

  const filteredCampuses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return campuses;
    return campuses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.univCode.toLowerCase().includes(q) ||
        c.univName.toLowerCase().includes(q)
    );
  }, [search, campuses]);

  const handleSelect = (campus: Campus) => {
    onSelectCampus(campus);
    onClose();
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Select campus"
      description={`Current: ${selectedCampus.title} (${selectedCampus.univCode})`}
    >
      <div className="space-y-3.5 pt-1">
        {/* Search input with search icon */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campus..."
            className="h-10 pl-9 pr-9 rounded-lg text-sm bg-secondary/50 border-border focus-visible:ring-1 focus-visible:ring-primary"
            autoComplete="off"
            autoFocus={false}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <FontAwesomeIcon icon={faXmark} className="size-3" />
            </button>
          )}
        </div>

        {/* Campus List: Clean layout with campus title & university subtitle with bracketed code */}
        <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-0.5">
          {filteredCampuses.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No campuses found matching “{search}”
            </div>
          ) : (
            filteredCampuses.map((campus) => {
              const isSelected = campus.id === selectedCampus.id;
              return (
                <button
                  key={campus.id}
                  type="button"
                  onClick={() => handleSelect(campus)}
                  className={`w-full flex items-center justify-between gap-3 p-3 text-left rounded-lg border transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'border-primary/50 bg-primary-soft/30'
                      : 'border-border bg-card hover:bg-secondary/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={isSelected ? faLocationDot : faBuildingColumns}
                        className="size-4"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Campus Title */}
                      <p className="font-semibold text-sm text-foreground truncate">
                        {campus.title}
                      </p>
                      {/* University Subtitle with Code in brackets e.g. Haramaya University (HRU) */}
                      <p className="text-xs text-muted-foreground truncate">
                        {campus.univName} ({campus.univCode})
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <FontAwesomeIcon icon={faCheck} className="size-3" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
