import { keys } from '@antv/util';
import { Point } from '../../../types/common';
import {
    EdgeDisplayModel,
    EdgeModelData,
    EdgeShapeMap,
} from '../../../types/edge';
import { State } from '../../../types/item';
import { BaseEdge } from './base';

export class Polyline extends BaseEdge {
    public type = 'line-edge';
    public defaultStyles = {
        keyShape: {
            x1: 0,
            y1: 0,
            z1: 0,
            x2: 0,
            y2: 0,
            z2: 0,
            isBillboard: true,
        },
    };
    constructor(props) {
        super(props);
        // suggest to merge default styles like this to avoid style value missing
        // this.defaultStyles = mergeStyles([this.baseDefaultStyles, this.defaultStyles]);
    }
    public draw(
        model: EdgeDisplayModel,
        sourcePoint: Point,
        targetPoint: Point,
        shapeMap: EdgeShapeMap,
        diffData?: { previous: EdgeModelData; current: EdgeModelData },
        diffState?: { previous: State[]; current: State[] },
    ): EdgeShapeMap {
        const { data = {} } = model;

        const shapes: EdgeShapeMap = { keyShape: undefined };

        shapes.keyShape = this.drawKeyShape(
            model,
            sourcePoint,
            targetPoint,
            shapeMap,
            diffData,
        );

        if (data.haloShape) {
            shapes.haloShape = this.drawHaloShape(model, shapeMap, diffData);
        }

        if (data.labelShape) {
            shapes.labelShape = this.drawLabelShape(model, shapeMap, diffData);
        }

        // labelBackgroundShape
        if (data.labelBackgroundShape) {
            shapes.labelBackgroundShape = this.drawLabelBackgroundShape(
                model,
                shapeMap,
                diffData,
            );
        }

        if (data.iconShape) {
            shapes.iconShape = this.drawIconShape(model, shapeMap, diffData);
        }

        // TODO: other shapes

        return shapes;
    }
    public drawKeyShape(
        model: EdgeDisplayModel,
        sourcePoint: Point,
        targetPoint: Point,
        shapeMap: EdgeShapeMap,
        diffData?: { previous: EdgeModelData; current: EdgeModelData },
        diffState?: { previous: State[]; current: State[] },
    ) {
        const { keyShape: keyShapeStyle } = this.mergedStyles;
        return this.upsertShape(
            'polyline',
            'keyShape',
            {
                ...keyShapeStyle,
                points: [[sourcePoint.x, sourcePoint.y], ...keyShapeStyle.points, [targetPoint.x, targetPoint.y]],
            },
            shapeMap,
            model,
        );
    }
}