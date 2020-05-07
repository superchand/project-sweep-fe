import React from 'react'
import {
    TopLeft,
    TopMiddle,
    TopRight,
    MiddleLeft,
    MiddleMiddle,
    MiddleRight,
    CheckoutLeft,
    CheckoutMiddle,
    CheckoutRight,
} from '../resources/maplayout/index'

import { showAisle } from '../resources/maplayout/pathsSVG'
import Waypoint from './Waypoint'
//import Waypoint from './Waypoint'

export default function CreateMap(
    layout,
    aisleInfo,
    aislesToVisit,
    svgPath,
    aisleListCat,
    listItems
) {
    /*     console.log(
        layout,
        aisleInfo,
        aislesToVisit,
        svgPath,
        aisleListCat,
        listItems
    ) */
    return (
        <>
            <path
                className="path"
                d={`M45 ${
                    200 + (layout.length - 2) * 160 + 165
                } v-5 ${svgPath}`}
                stroke="red"
                stroke-width="8px"
                fill="transparent"
                strokeLinecap="round"
            ></path>

            {layout.flat().map((aisle) => {
                switch (aisleInfo[aisle].type) {
                    case 'tl':
                        return (
                            <>
                                <TopLeft x="0" y="0" />
                            </>
                        )
                    case 'tm':
                        return <TopMiddle x={aisleInfo[aisle].x * 80} y="0" />
                    case 'tr':
                        return <TopRight x={aisleInfo[aisle].x * 80} y="0" />
                    case 'ml':
                        return (
                            <MiddleLeft
                                x="0"
                                y={200 + (aisleInfo[aisle].y - 1) * 160}
                            />
                        )
                    case 'mm':
                        return (
                            <MiddleMiddle
                                x={aisleInfo[aisle].x * 80}
                                y={200 + (aisleInfo[aisle].y - 1) * 160}
                            />
                        )
                    case 'mr':
                        return (
                            <MiddleRight
                                x={aisleInfo[aisle].x * 80}
                                y={200 + (aisleInfo[aisle].y - 1) * 160}
                            />
                        )
                    case 'cl':
                        return (
                            <CheckoutLeft
                                x="0"
                                y={200 + (aisleInfo[aisle].y - 1) * 160}
                            />
                        )
                    case 'cm':
                        return (
                            <CheckoutMiddle
                                x={aisleInfo[aisle].x * 80}
                                y={200 + (aisleInfo[aisle].y - 1) * 160}
                            />
                        )
                    case 'cr':
                        return (
                            <CheckoutRight
                                x={aisleInfo[aisle].x * 80}
                                y={200 + (aisleInfo[aisle].y - 1) * 160}
                            />
                        )
                    default:
                        return null
                }
            })}

            {layout.flat().map((aisleNum) => {
                const aisleData = aisleInfo[aisleNum]
                const type = aisleData.type
                const x = aisleData.x
                const y = aisleData.y

                const xy = 'xy' + x.toString() + y.toString()
                return (
                    <svg
                        x={`${x * 80}`}
                        y={`${200 + (aisleInfo[aisleNum].y - 1) * 160}`}
                        id={xy}
                        width="80px"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        {aislesToVisit[xy] ? (
                            aislesToVisit[xy].waypoint ? (
                                <Waypoint
                                    cy={80}
                                    num={aisleNum}
                                    food={
                                        aisleListCat.food[aisleNum]
                                            ? aisleListCat.food[aisleNum]
                                            : null
                                    }
                                    listItems={listItems}
                                />
                            ) : (
                                showAisle(aisleNum, 80)
                            )
                        ) : (
                            showAisle(aisleNum, 80)
                        )}
                    </svg>
                )
            })}
        </>
    )
}
