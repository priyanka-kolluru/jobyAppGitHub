import './index.css'

const FiltersGroup = props => {
  const {
    employmentTypesList,
    salaryRangesList,
    changeEmployment,
    removeEmployment,
    changeSalaryRange,
    removeSalaryRange,
  } = props

  const employmentListFilter = () => {
    const changeInput = event => {
      if (event.target.checked) {
        changeEmployment(event.target.id)
      } else {
        removeEmployment(event.target.id)
      }
    }

    return (
      <li className="list-containers">
        {employmentTypesList.map(each => (
          <ul key={each.employmentTypeId}>
            <input
              id={each.employmentTypeId}
              type="checkbox"
              onChange={changeInput}
            />
            <label htmlFor={each.employmentTypeId} className="label">
              {each.label}
            </label>
          </ul>
        ))}
      </li>
    )
  }

  const salaryRangeList = () => {
    const changeInput = event => {
      if (event.target.checked) {
        changeSalaryRange(event.target.id)
      } else {
        removeSalaryRange(event.target.id)
      }
    }

    return (
      <li className="list-container">
        {salaryRangesList.map(each => (
          <ul key={each.salaryRangeId}>
            <input
              id={each.salaryRangeId}
              type="radio"
              onChange={changeInput}
            />
            <label htmlFor={each.salaryRangeId} className="label">
              {each.label}
            </label>
          </ul>
        ))}
      </li>
    )
  }

  return (
    <div>
      <div className="part">
        <h1 className="employment-head">Type of Employment</h1>
        {employmentListFilter()}
      </div>
      <div className="part">
        <h1 className="employment-head">Salary Range</h1>
        {salaryRangeList()}
      </div>
    </div>
  )
}

export default FiltersGroup
