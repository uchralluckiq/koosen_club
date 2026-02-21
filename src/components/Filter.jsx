function Filter({ filters, setFilters }) {
  return (
    <div className="flex w-full px-4 sm:px-6 lg:px-10 pt-6 pb-4 sm:pb-6 justify-center border-b border-border-default bg-block-background-filter">
      <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-center items-center flex-wrap">
        <select
          className="rounded-xl py-2 px-3 sm:px-4 bg-input-background text-text-heading text-xs sm:text-sm min-w-0 border border-border-input focus:border-focus-ring outline-none"
          value={filters.year || ''}
          onChange={(e) =>
            setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : '' })
          }
        >
          <option value="">Курс</option>
          <option value="1">1-р</option>
          <option value="2">2-р</option>
          <option value="3">3-р</option>
          <option value="4">4-р</option>
          <option value="5">5-р</option>
        </select>

        <select
          className="rounded-xl py-2 px-3 sm:px-4 bg-input-background text-text-heading text-xs sm:text-sm min-w-0 border border-border-input focus:border-focus-ring outline-none"
          value={filters.class || ''}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
        >
          <option value="">Мэргэжил</option>
          <option value="1">Барилга</option>
          <option value="2">Механик</option>
          <option value="3">Цахилгаан</option>
          <option value="4">Био</option>
          <option value="5">Компьютер</option>
        </select>

        <select
          className="rounded-xl py-2 px-3 sm:px-4 bg-input-background text-text-heading text-xs sm:text-sm min-w-0 border border-border-input focus:border-focus-ring outline-none"
          value={filters.type || ''}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">Төрөл</option>
          <option value="contest">Тэмцээн</option>
          <option value="sport">Спорт</option>
          <option value="art">Урлаг</option>
          <option value="education">Боловсрол</option>
        </select>
      </div>
    </div>
  )
}

export default Filter
