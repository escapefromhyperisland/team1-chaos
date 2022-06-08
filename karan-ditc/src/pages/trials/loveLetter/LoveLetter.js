import { useContext, useEffect, useState } from 'react'
import {
    SuccessMessageComp,
    LoveLetterMainContainer,
    LoveLetterElems,
    LoveLetterSymbolsContainer,
    LoveLetterLettersContainer,
    LoveLetterSpace,
    LoveLetterSymbolElems,
    Container
} from './loveLetterComponents/LoveLetterComponents'
import GameContext from '../../../context/GameContext'
import { loveLetterData } from '../../../data/lessonData'
import NextPageButton from '../../../generalComponents/NextPageButton'
import { SpeechBubbleLeft } from '../../../generalComponents/ConversationComponents'
import teacher from '../../../images/teacher.png'


function LoveLetter(props) {
    const { setCompletedChallenges } = useContext(GameContext)
    const { isLoveLetterCorrect, setIsLoveLetterCorrect } = useContext(GameContext)
    const [selectedLetter, setSelectedLetter] = useState('')
    const [selectedSymbol] = useState('')
    const [usedLetters, setUsedLetters] = useState([])
    const [successMessage, setSuccessMessage] = useState('')
    const [isSuccessMessageDisplayed, setIsSuccessMessageDisplayed] = useState(false)

    const { instructions, loveLetterCode, successMessageText, loveLetterFull, loveLetterFullPs } = loveLetterData
    const secretMessage = loveLetterCode[0]
    const secretMessageArray = secretMessage.toLowerCase().split('');

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    function handleFullTextClick() {
        setIsLoveLetterCorrect(true)
    }

    function handleLetterClick(e) {
        setSelectedLetter(e.target.id)
    }

    function handleSymbolClick(e) {
        if (selectedLetter) {
            const tileToRemove = (e.target.innerText)
            let tilesToChange = e.target.classList[2];
            let tilesArray = document.getElementsByClassName(tilesToChange)
            tilesArray = [...tilesArray]
            tilesArray.forEach(element => {
                element.innerText = selectedLetter
                element.style.color = 'midnightblue'
                element.style.backgroundColor = 'yellow'
            });
            setSelectedLetter('')
            const dummyUsedLetters = [...usedLetters]
            const indexLetterToDelete = dummyUsedLetters.indexOf(tileToRemove)
            if (indexLetterToDelete > -1) { dummyUsedLetters.splice(indexLetterToDelete, 1) }
            dummyUsedLetters.push(selectedLetter)
            setUsedLetters(dummyUsedLetters)
            let decodedMessageArray = document.getElementsByClassName('symbolsClass')
            decodedMessageArray = [...decodedMessageArray]
            let decodedMessage = []
            decodedMessageArray.forEach(item => { decodedMessage.push(item.innerText) })
            decodedMessage = decodedMessage.join('')
            const originalMessageNoSpace = secretMessageArray.join('').replace(/\s+/g, '')

            if (decodedMessage === originalMessageNoSpace) { //change here for debug mode
                setSuccessMessage(<SuccessMessageComp 
                    message={successMessageText} 
                    onclick={handleFullTextClick} />)
                setIsSuccessMessageDisplayed(true)
                setCompletedChallenges(prev => {
                    return [props.artefactName, ...prev]
                })
                const scrollToHere = document.getElementById('scrollToHere')
                scrollToHere.scrollIntoView()
            }
        }
    }

    useEffect(() => {
        usedLetters.map((item => document.getElementById(item).classList.add('unClickable')
        ))

    }, [usedLetters])

    const LoveLetterLetters = loveLetterData['letters'].map((item, index) => {
        return (
            <LoveLetterElems
                key={index}
                color={usedLetters.indexOf(item[0]) > -1 ? 'transparent' : item[0] === selectedLetter ? 'red' : '#f5c71a'}
                onClick={handleLetterClick}
                id={item[0]}>
                {item[0]}
            </LoveLetterElems>)
    }
    )


    const LoveLetterCode = secretMessageArray.map((item, index) => {

        const targetSymbol = typeof loveLetterData['symbols'][loveLetterData['letters'].indexOf(item)] === 'object' ?
            String.fromCharCode(loveLetterData['symbols'][loveLetterData['letters'].indexOf(item)][1])
            :
            null

        return (
            <div key={index + 100} >
                {targetSymbol ?
                    <LoveLetterSymbolElems

                        isSuccessMessageDisplayed={isSuccessMessageDisplayed}
                        className={`${targetSymbol.charCodeAt(0)} symbolsClass`}
                        onClick={handleSymbolClick}
                        color={targetSymbol.charCodeAt(0) === parseInt(selectedSymbol) ? 'red' : 'midnightblue'}>
                        {targetSymbol}
                    </LoveLetterSymbolElems>
                    :
                    <LoveLetterSpace
                    />
                }
            </div>
        )
    })

    return (
        <>
            <Container>
                <div id="scrollToHere"></div>
                <SpeechBubbleLeft image={teacher} >
                    {!isSuccessMessageDisplayed ? instructions : successMessage}
                </SpeechBubbleLeft>
                <LoveLetterMainContainer>
                    <LoveLetterSymbolsContainer
                        bgColor={!isSuccessMessageDisplayed ? 'whitesmoke' : isLoveLetterCorrect ? 'whitesmoke' : 'limegreen'} >
                        {!isLoveLetterCorrect ? LoveLetterCode :
                            <><p className="whiteBG">{loveLetterFull}</p><p className="whiteBG">
                                {loveLetterFullPs}</p>
                                <NextPageButton destination="office">Go to office</NextPageButton>
                            </>}
                    </LoveLetterSymbolsContainer>
                    <LoveLetterLettersContainer>
                        {LoveLetterLetters}
                    </LoveLetterLettersContainer>
                </LoveLetterMainContainer>
            </Container>
        </>
    )
}

export default LoveLetter