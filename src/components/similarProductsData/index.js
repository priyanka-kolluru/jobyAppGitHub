import './index.css'
import {FaStar} from 'react-icons/fa'
import {IoBagSharp, IoLocationSharp} from 'react-icons/io5'

const similarProductsDataComponent = props => {
  const {list} = props
  const {
    companyLogoUrl,
    employmentType,
    location,
    jobDescription,
    rating,
    title,
  } = list

  return (
    <div className="jobs jobSimilarProducts">
      <div className="inner1-part1">
        <img src={companyLogoUrl} alt="company logo" className="companyLogo" />
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

export default similarProductsDataComponent
