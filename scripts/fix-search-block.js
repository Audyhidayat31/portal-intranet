const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/app/(portal)/kabar-kedinasan/berita/page.tsx');
let lines = fs.readFileSync(targetPath, 'utf8').split(/\r?\n/);

const newControlsBlockLines = `        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Left: Tampilkan [ 9 v ] data */}
          <div className="flex items-center gap-2 text-sm text-[#1a1b20] shrink-0" ref={perPageRef}>
            <span className="font-normal text-[#1a1b20]">Tampilkan</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-2.5 py-0.5 rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="w-3 h-3 text-white fill-white" />
              </button>

              {isPerPageOpen && (
                <div className="absolute left-0 top-full mt-1 w-14 bg-white border border-[#c5c6d2] rounded-sm shadow-md z-30 py-1 text-center">
                  {[9, 18, 27].filter((n) => n !== itemsPerPage).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1); // Reset page when changing items per page
                        setIsPerPageOpen(false);
                      }}
                      className="w-full text-xs py-1 hover:bg-[#efedf3] text-[#1a1b20] transition-colors cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="font-normal text-[#1a1b20]">data</span>
          </div>

          {/* Right: Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto md:min-w-[400px]">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Berita terkini..."
                className="w-full border border-[#c5c6d2] rounded-lg py-2 px-4 text-base bg-white text-[#1a1b20] placeholder-[#757682] focus:outline-none focus:border-[#00113a] focus:ring-1 focus:ring-[#00113a] transition-all"
              />
            </div>
            <button
              type="submit"
              aria-label="Cari"
              className="bg-[#e9e7ee] border border-[#c5c6d2] rounded-lg px-4 flex items-center justify-center hover:bg-[#dad9e0] transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-5 h-5 text-[#444650]" />
            </button>
          </form>
        </div>`.split('\n');

// Find the index of the Search Bar block
const startIndex = lines.findIndex(line => line.includes('{/* Search Bar matching Opini */}'));

if (startIndex !== -1) {
  // It should end at `        </div>` which is 20 lines later
  lines.splice(startIndex, 21, ...newControlsBlockLines);
  fs.writeFileSync(targetPath, lines.join('\n'), 'utf8');
  console.log('Successfully replaced search block with controls row.');
} else {
  console.log('Could not find Search Bar block.');
}
