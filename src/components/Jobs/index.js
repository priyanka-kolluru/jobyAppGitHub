import './index.css'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {IoBagSharp, IoLocationSharp} from 'react-icons/io5'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import FiltersGroup from '../FiltersGroup'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    profileDetails: [],
    apiStatus: apiStatusConstants.initial,
    employmentTypeId: '',
    salaryRangeId: '',
    jobsList: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobProfiles()
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearch = event => {
    if (event.key === 'Enter') {
      this.setState({searchInput: event.target.value}, this.getJobProfiles)
    }
  }

  getData = each => ({
    name: each.name,
    profileImageUrl: each.profile_image_url,
    shortBio: each.short_bio,
  })

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()

    const updatedData = this.getData(data.profile_details)
    this.setState({profileDetails: updatedData})
  }

  renderProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  changeEmployment = id => {
    this.setState(
      prevState => ({employmentTypeId: [...prevState.employmentTypeId, id]}),
      this.getJobProfiles,
    )
  }

  removeEmployment = id => {
    const {employmentTypeId} = this.state
    const editedEmployment = employmentTypeId.filter(each => each !== id)
    this.setState({employmentTypeId: editedEmployment}, this.getJobProfiles)
  }

  changeSalaryRange = id => {
    this.setState(
      prevState => ({salaryRangeId: [...prevState.salaryRangeId, id]}),
      this.getJobProfiles,
    )
  }

  renderFilters = () => (
    <div className="filters-group">
      <FiltersGroup
        employmentTypesList={employmentTypesList}
        salaryRangesList={salaryRangesList}
        changeEmployment={this.changeEmployment}
        removeEmployment={this.removeEmployment}
        changeSalaryRange={this.changeSalaryRange}
      />
    </div>
  )

  getJobProfiles = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, employmentTypeId, salaryRangeId} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${salaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsListView = () => {
    const {jobsList} = this.state

    return (
      <div>
        {jobsList.map(each => (
          <Link to={`/jobs/${each.id}`} key={each.id}>
            <div className="jobs">
              <div className="part1">
                <div className="inner1-part1">
                  <img
                    src={each.companyLogoUrl}
                    alt="company logo"
                    className="companyLogo"
                  />
                  <div>
                    <h1 className="title-container">{each.title}</h1>
                    <p className="title-container">
                      <FaStar className="star" />
                      {each.rating}
                    </p>
                  </div>
                </div>
                <div className="inner2-part1">
                  <div className="inner1-part1">
                    <IoLocationSharp />
                    <p className="job-location">{each.location}</p>
                    <IoBagSharp />
                    <p className="job-location">{each.employmentType}</p>
                  </div>
                  {each.packagePerAnnum}
                </div>
              </div>
              <div className="part2">
                <h1 className="description">Description</h1>
                <p>{each.jobDescription}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.getProfileDetails()
    this.getJobProfiles()
  }

  renderFailureView = () => (
    <div className="notFoundContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt=" failure view"
        className="failure"
      />
      <h1 className="head-notFound">Oops! Something Went Wrong</h1>
      <p className="para-notFound">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="btn" onClick={this.onRetry()}>
        Retry
      </button>
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="input1">
            {this.renderProfile()}
            {this.renderFilters()}
          </div>
          <div>
            <input
              type="search"
              className="inputs"
              placeholder="Search"
              onChange={this.onChangeSearch}
              onKeyDown={this.onEnterSearch}
            />
            <button type="button" data-testid="searchButton">
              <BsSearch className="search-icon" />
            </button>
            {this.renderAllJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
