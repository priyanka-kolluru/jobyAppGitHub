import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {IoBagSharp, IoLocationSharp} from 'react-icons/io5'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getItemDetails()
  }

  getUpdatedData = each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    id: each.id,
    jobDescription: each.job_description,
    location: each.location,
    packagePerAnnum: each.package_per_annum,
    rating: each.rating,
    title: each.title,
    lifeAtCompany: each.life_at_company,
    skills: each.skills,
  })

  data1 = each => ({
    jobDetails: each.job_details,
    similarJobs: each.similar_jobs,
  })

  getItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jobUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobUrl, options)

    if (response.ok) {
      const data = await response.json()
      const data2 = this.data1(data)
      console.log(data2)
      const updatedData = this.getUpdatedData(data2.jobDetails)
      const similarProductsData = data2.similarJobs.map(each =>
        this.getUpdatedData(each),
      )
      console.log(updatedData, similarProductsData)
      this.setState({
        jobDetails: updatedData,
        similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getSkills = each => ({
    imageUrl: each.image_url,
    name: each.name,
    description: each.description,
  })

  getHtmlData = each => {
    const {
      companyLogoUrl,
      employmentType,
      location,
      packagePerAnnum,
      jobDescription,
      rating,
      title,
    } = each

    return (
      <div className="jobs jobSimilarProducts">
        <div className="inner1-part1">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="companyLogo"
          />
          <div>
            <h1 className="title-container">{title}</h1>
            <p className="title-container">
              <FaStar className="star" />
              {rating}
            </p>
          </div>
        </div>
        <div className="part2">
          <h1 className="description">Description</h1>
          <p>{jobDescription}</p>
        </div>
        <div className="inner1-part1">
          <IoLocationSharp />
          <p className="job-location">{location}</p>
          <IoBagSharp />
          <p className="job-location">{employmentType}</p>
        </div>
      </div>
    )
  }

  renderJobsDetailsView = () => {
    const {jobDetails, similarProductsData} = this.state
    const {
      companyLogoUrl,
      employmentType,
      location,
      packagePerAnnum,
      jobDescription,
      rating,
      title,
      lifeAtCompany,
      skills,
    } = jobDetails
    const skills1 = skills.map(each => this.getSkills(each))
    const life = this.getSkills(lifeAtCompany)

    return (
      <>
        <Header />
        <div className="jobDetails">
          <div className="jobs">
            <div className="part1">
              <div className="inner1-part1">
                <img
                  src={companyLogoUrl}
                  alt="company logo"
                  className="companyLogo"
                />
                <div>
                  <h1 className="title-container">{title}</h1>
                  <p className="title-container">
                    <FaStar className="star" />
                    {rating}
                  </p>
                </div>
              </div>
              <div className="inner2-part1">
                <div className="inner1-part1">
                  <IoLocationSharp />
                  <p className="job-location">{location}</p>
                  <IoBagSharp />
                  <p className="job-location">{employmentType}</p>
                </div>
                {packagePerAnnum}
              </div>
            </div>
            <div className="part2">
              <h1 className="description">Description</h1>
              <p>{jobDescription}</p>
            </div>
            <div className="part3">
              <h1 className="skills">Skills</h1>
              <ul className="unordered-skills">
                {skills1.map(eachSkill => (
                  <li className="list-skill">
                    <img
                      src={eachSkill.imageUrl}
                      alt={eachSkill.name}
                      className="skill-logos"
                    />
                    <p>{eachSkill.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="part4">
              <h1>Life at company</h1>
              <div className="part">
                <p>{life.description}</p>
                <img src={life.imageUrl} alt={title} />
              </div>
            </div>
          </div>
          <h1 className="similar">Similar Jobs</h1>
          <ul className="popular">
            {similarProductsData.map(eachProduct =>
              this.getHtmlData(eachProduct),
            )}
          </ul>
        </div>
      </>
    )
  }

  onRetry = () => {
    this.getItemDetails()
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

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobItemDetails
