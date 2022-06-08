import { useState, useContext, useEffect } from 'react'
import { Container, ArtefactDisplay, WitnessCard, CardImageContainer, CardImage, ArtefactCard } from './officeComponents/OfficeComponents'
import GameContext from '../../context/GameContext'
import { StyledModal, ToggleContainer, ToggleTaskInfo } from '../../generalComponents/InfoModal'
import { officeBubbleText, officeCards, guessText, officeBubbleTextSmall } from '../../data/lessonData'
import WitnessButton from './../../generalComponents/WitnessButton'
import { SpeechBubbleLeft } from './../../generalComponents/ConversationComponents'
import magnify from './../../images/magnify.png'
import teacher from '../../images/teacher.png'
import suspectPic from '../../images/suspect.jpg'

function Office() {

    const {
        isInstructionsModalDisplayed,
        collectedArtefacts,
        collectedWitnesses,
        completedChallenges,
        completedWitnesses
    } = useContext(GameContext)

    const [isArtefactModalDisplayed, setIsArtefactModalDisplayed] = useState(false)
    const [artefactImageToDisplay, setArtefactImageToDisplay] = useState('')
    const [isReadyGuess, setIsReadyGuess] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (completedChallenges.length >= 5) {
            setIsReadyGuess(true)
        }
    }, [completedChallenges])

    const witnesses = officeCards.witnesses.map((item, index) => {
        if (collectedWitnesses.indexOf(item.name) > -1) {
            const destination = `/witness${item.id}`
            const isKnown = completedWitnesses.indexOf(item.name.toString()) > -1
            return (
                <WitnessCard key={`index${index}`} borderColor={isKnown ? 'limeGreen' : 'whitesmoke'} opacity={isKnown ? '0.5' : '1'}><CardImageContainer><CardImage src={item.image} /></CardImageContainer><WitnessButton destination={destination} isDisabled={false}>{item.name}</WitnessButton></WitnessCard>
            )
        }
        else {
            return (
                <WitnessCard borderColor="whitesmoke" key={`index${index}`}><CardImageContainer><CardImage src={item.altImage} alt="placeholder image for witness" /></CardImageContainer>{item.altName}</WitnessCard>
            )
        }
    })


    function handleArtefactImageClick(image) {
        setArtefactImageToDisplay(image)
        setIsArtefactModalDisplayed(true)
    }

    const artefacts = officeCards.artefacts.map((item, index) => {
        if (collectedArtefacts.indexOf(item.name) > -1) {
            return (
                completedChallenges.indexOf(item.name) > -1 ?
                    <ArtefactCard borderColor="limegreen" bgColor="black" key={`index${index}`}><img src={item.image} alt="artefact" /><WitnessButton destination={item.destination}>{item.name}</WitnessButton></ArtefactCard> :
                    item.id < 6 ?
                        <ArtefactCard borderColor="whitesmoke" bgColor="#333" key={`index${index}`}><img src={item.image} alt="artefact" /><WitnessButton destination={item.destination}>{item.name}</WitnessButton></ArtefactCard> :
                        <ArtefactCard borderColor="whitesmoke" bgColor="#333" key={`index${index}`}><img src={item.image} alt="artefact" onClick={() => handleArtefactImageClick(item.image)} />{item.name}</ArtefactCard>
                        )
                    }
                    else {
                        return (
                            <ArtefactCard borderColor="whitesmoke" bgColor="#333" key={`index${index}`}><img height="75px" src={magnify} alt="evidence placeholder" /><p>Evidence</p></ArtefactCard>
                            )
                        }
                        
                    })
                    
                    const suspect = <ArtefactCard borderColor="whitesmoke" bgColor="#141414"><img src={suspectPic} alt="suspect silhouette in crosshairs" /><WitnessButton destination="endpage" fontSize="1rem" bgColor="red">Guess!</WitnessButton></ArtefactCard>


    return (
        <>
            <Container>

                <SpeechBubbleLeft image={teacher} >
                    {isReadyGuess ? guessText :
                        isInstructionsModalDisplayed ?
                        officeBubbleText : officeBubbleTextSmall}

                </SpeechBubbleLeft>
                <StyledModal display={isArtefactModalDisplayed ? 'flex' : 'none'}>
                    <ArtefactDisplay><p>This is just Evidence for you to consider. There is no challenge.</p><img src={artefactImageToDisplay} alt="artefact" /></ArtefactDisplay>
                    <ToggleContainer>
                        <ToggleTaskInfo
                            onClick={() => setIsArtefactModalDisplayed(!isArtefactModalDisplayed)}>
                            Close
                        </ToggleTaskInfo>
                    </ToggleContainer>
                </StyledModal>
                {witnesses}
                {artefacts}
                {isReadyGuess ? suspect : null}
            </Container>
        </>
    )
}

export default Office