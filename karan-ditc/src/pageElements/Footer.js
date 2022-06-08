import FooterContainer from '../containers/FooterContainer'
import { Link, HashRouter as Router } from 'react-router-dom'

function Footer() {
    let date = new Date()
    let year = date.getFullYear()
    return (
        <>
            <FooterContainer>
                <Router>
                <Link to="/" >Home</Link>
                <Link to="/" >Copyright &#160;{year}</Link>
                </Router>

            </FooterContainer>
        </>
    )
}

export default Footer