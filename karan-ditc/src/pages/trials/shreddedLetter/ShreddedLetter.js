import { useState, useContext, useEffect } from 'react'
import { List, arrayMove } from 'react-movable';
import { ShreddedLetterPiecesData } from '../../../data/lessonData'
import { EventsContainer, ShreddedPiece } from './shreddedLetterComponents/ShreddedLetterComponents'
import { SpeechBubbleLeft } from '../../../generalComponents/ConversationComponents'
import NextPageButton from '../../../generalComponents/NextPageButton'
import { FrontPageButton } from '../../../generalComponents/GeneralButton'
import { MessageContainer } from '../../../containers/MessageContainer'
import GameContext from '../../../context/GameContext'
import teacher from '../../../images/teacher.png'
import { TaskMessage } from '../../../generalComponents/TaskMessage'



function ShreddedLetter(props) {
    const taskText = `Hit check when finished`
    const taskCorrect = `Correct!`
    const taskIncorrect = `That's incorrect. Try again.`
    const { setCompletedChallenges } = useContext(GameContext)
    const { isShreddedLetterCorrect, setIsShreddedLetterCorrect } = useContext(GameContext)

    let { eventsToOrder, instructions } = ShreddedLetterPiecesData
    const { eventsCorrectOrder } = ShreddedLetterPiecesData
    const [message, setMessage] = useState(<TaskMessage task="true" message={taskText} />)
    const [itemsToOrder, setItemsToOrder] = useState(eventsToOrder);
    const [itemsCorrectOrder, setItemsCorrectOrder] = useState(eventsCorrectOrder);
    const [hasFinished, setHasFinished] = useState(false)

    useEffect(()=>{
        window.scrollTo(0,0)
      },[])

    useEffect(() => {
        function checkFinish(){
        if (hasFinished) {
            if (eventsCorrectOrder.toString() === itemsToOrder.toString()) {
                setMessage(<TaskMessage correct="true" message={taskCorrect} />)
                setIsShreddedLetterCorrect(true)
                setCompletedChallenges(prev => {
                    return (
                        [props.artefactName, ...prev]
                    )
                })
            }
            else {
                setMessage(<TaskMessage incorrect="true" message={taskIncorrect} />)
                setHasFinished(false)
            }
        }
    }
    checkFinish()
    }, [itemsToOrder, hasFinished, eventsCorrectOrder, props.artefactName, setCompletedChallenges, setIsShreddedLetterCorrect, taskCorrect, taskIncorrect])
    //completedChallenges, eventsCorrectOrder, props.artefactName, setCompletedChallenges, setIsShreddedLetterCorrect, taskCorrect, taskIncorrect

    





    function handleCheck() {
        setHasFinished(true)
    }

    return (
        <>
            <SpeechBubbleLeft image={teacher} minHeight="140">
                {instructions}
            </SpeechBubbleLeft>
            <EventsContainer>
                {!isShreddedLetterCorrect ?
                    <List
                        values={itemsToOrder}
                        onChange={({ oldIndex, newIndex }) => {
                            setItemsToOrder(arrayMove(itemsToOrder, oldIndex, newIndex))
                        }
                        }
                        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
                        renderItem={({ value, props }) => {
                            return <li className="eventOrderClass" {...props} disabled={true}><ShreddedPiece isShreddedLetterCorrect={isShreddedLetterCorrect}>{value}</ShreddedPiece></li>
                        }
                        }
                    /> :
                    <List
                        values={itemsCorrectOrder}
                        onChange={({ oldIndex, newIndex }) => {
                            setItemsCorrectOrder(arrayMove(itemsCorrectOrder, oldIndex, newIndex))
                        }
                        }
                        renderList={({ children, props }) => <ul {...props}>{children}</ul>}
                        renderItem={({ value, props }) => {
                            return <li className="eventOrderClass correctOrder" {...props} disabled={true}><ShreddedPiece isShreddedLetterCorrect={isShreddedLetterCorrect}>{value}</ShreddedPiece></li>
                        }
                        }
                    />}
                <MessageContainer bgColor="white" width="40">
                    {message ? message : null}
                    {isShreddedLetterCorrect ? <NextPageButton destination="office" margin=".5em auto">Go to Office</NextPageButton> : <FrontPageButton onclick={handleCheck} fontSize="1rem" bgColor="red">Check</FrontPageButton>}
                </MessageContainer>
            </EventsContainer>
        </>
    );
}

export default ShreddedLetter