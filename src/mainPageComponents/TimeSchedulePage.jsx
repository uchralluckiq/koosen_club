import { useState } from 'react'
import SubjectSchedules from '../components/SubjectSchedules'
import ClubSchedules from '../components/ClubSchedules'

const TAB_SCHOOL = 'school'
const TAB_CLUB = 'club'

function TimeSchedulePage() {
  const [activeTab, setActiveTab] = useState(TAB_SCHOOL)

  return (
    <div className="px-4 sm:px-6 py-6">
      <h1 className="text-base sm:text-xl font-bold text-text-title mb-4">
        Цагийн хуваарь
      </h1>

      <div className="flex border-b border-border-default mb-4 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab(TAB_SCHOOL)}
          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === TAB_SCHOOL
              ? 'bg-block-background-muted text-text-heading border-b-2 border-button-primary'
              : 'text-text-muted hover:text-text-paragraph'
          }`}
        >
          Хичээлийн хуваарь
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TAB_CLUB)}
          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors ${
            activeTab === TAB_CLUB
              ? 'bg-block-background-muted text-text-heading border-b-2 border-button-primary'
              : 'text-text-muted hover:text-text-paragraph'
          }`}
        >
          Клубын хуваарь
        </button>
      </div>

      {activeTab === TAB_SCHOOL && <SubjectSchedules />}
      {activeTab === TAB_CLUB && <ClubSchedules />}
    </div>
  )
}

export default TimeSchedulePage
