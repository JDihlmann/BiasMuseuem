import AI from "@/components/ai/ai"
import HINT from "@/components/hint/hint"
import Background from "@/components/background/background"
import ProgressBar from "@/components/progressBar/progressBar"
import DatasetSelector from "@/components/datasetSelector/datasetSelector"
import { Message } from "@/components/message/message"
import Title from "@/components/title/title"
import { AIPrompt } from "@/data/aiPrompt"
import { HintPrompt } from "@/data/hintPrompt"
import { Dataset, useGame } from "@/stores/gameStore"
import { FunctionComponent, useEffect, useState } from "react"

interface GameProps {
	scale?: number
}

const Game: FunctionComponent<GameProps> = ({ scale = 1.0 }) => {
	const currentLevel = useGame((state) => state.currentLevel)
	const level = useGame((state) => state.levels[state.currentLevel])
	const datasets = useGame((state) => state.actions.datasetsForLevel(level))
	const progressLevel = useGame((state) => state.actions.progressLevel)

	const [isChecking, setIsChecking] = useState(false)
	const [aiMessages, aiSetMessages] = useState<Message[]>(level.aiPrompt.prompt)
	const [hintMessages, setHintMessages] = useState<Message[]>(level.hintPrompt.hint)
	const [progressPercentage, setProgressPercentage] = useState(0)

	useEffect(() => {
		setIsChecking(false)
		aiSetMessages(level.aiPrompt.prompt)
		setHintMessages(level.hintPrompt.hint)
	}, [level])

	useEffect(() => {
		if (isChecking) {
			setProgressPercentage(((currentLevel + 1) * 2 + 1) / 7)
		} else {
			setProgressPercentage(((currentLevel + 1) * 2) / 7)
		}
	}, [level, isChecking])

	return (
		<Background offset={800} isInAI scale={scale}>
			<Title title="Bias & KI" isInAI />
			<div
				style={{
					position: "absolute",
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					justifyContent: "center",
				}}
			>
				<AI messages={aiMessages} position={{ x: 100, y: 800 }} chatOffset={{ x: 300, y: 140 }} />
				<ProgressBar
					percentage={progressPercentage} //TODO: Change into useful percentage measure
				/>
				<DatasetSelector
					title={level.title}
					datasets={datasets}
					hintMessages={hintMessages}
					confirmDataset={(index) => {
						setIsChecking(true)
						if (index == level.correctDataset) {
							aiSetMessages(level.aiPrompt.correctAnswer)
						} else {
							aiSetMessages(level.aiPrompt.wrongAnswers)
						}
					}}
					nextLevel={() => {
						progressLevel()
					}}
					isChecking={isChecking}
					correctDataset={level.correctDataset}
					done={currentLevel == 2 && isChecking}
				/>
			</div>
		</Background>
	)
}

export default Game
