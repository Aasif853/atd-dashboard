import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('canvasStickFigure') canvasRef!: ElementRef<HTMLCanvasElement>;

  figureWidth = 400;
  figureHeight = 400;

  sensorInput = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[GRY]{9}$/i),
  ]);

  sensorStatus: string[] = Array(9).fill('');

  stickFigureLines: StickFigure[] = [
    {
      id: 1,
      x: 0.5,
      y: 0.1,
      toId: 1,
      slug: 'head',
      sensor: { sensorId: 1 },
    },
    {
      id: 2,
      x: 0.5,
      y: 0.2,
      toId: 3,
      slug: 'nect',
      sensor: { sensorId: 2 },
    },

    {
      id: 4,
      x: 0.2,
      y: 0.2,
      toId: 5,
      slug: 'right_hand',
      sensor: { sensorId: 3 },
    },
    {
      id: 5,
      x: 0.3,
      y: 0.3,
      toId: 3,
      slug: 'right_shoulder',
      sensor: { sensorId: 4 },
    },
    {
      id: 6,
      x: 0.8,
      y: 0.2,
      toId: 7,
      slug: 'left_hand',
      sensor: { sensorId: 6 },
    },
    {
      id: 7,
      x: 0.7,
      y: 0.3,
      toId: 3,
      slug: 'left_shoulder',
    },
    {
      id: 3,
      x: 0.5,
      y: 0.3,
      toId: 8,
      slug: 'chest',
      sensor: { sensorId: 5 },
    },

    {
      id: 9,
      x: 0.3,
      y: 0.8,
      toId: 8,
      slug: 'right_foot',
      sensor: { sensorId: 7 },
    },
    {
      id: 10,
      x: 0.7,
      y: 0.8,
      toId: 8,
      slug: 'left_foot',
      sensor: { sensorId: 9 },
    },
    {
      id: 8,
      x: 0.5,
      y: 0.6,
      toId: 8,
      slug: 'foot_joint',
      sensor: { sensorId: 8 },
    },
  ];

  connectedLines = [[]];

  sensors: Sensor[] = [
    {
      sensorId: 1,
      x: 0.5,
      y: 0.1,
      slug: 'head',
    },
    {
      sensorId: 2,
      y: 0.2,
      slug: 'nect',
    },
    {
      sensorId: 5,
      x: 0.5,
      y: 0.3,
      slug: 'chest',
    },
    {
      sensorId: 3,
      x: 0.2,
      y: 0.2,
      slug: 'right_hand',
    },
    {
      sensorId: 4,
      x: 0.3,
      y: 0.3,
      slug: 'right_shoulder',
    },
    {
      sensorId: 6,
      x: 0.8,
      y: 0.3,
      slug: 'left_hand',
    },
    {
      sensorId: 8,
      x: 0.5,
      y: 0.6,
      slug: 'foot_joint',
    },
    {
      sensorId: 7,
      x: 0.3,
      y: 0.8,
      slug: 'right_foot',
    },
    {
      sensorId: 9,
      x: 0.7,
      y: 0.8,
      slug: 'left_foot',
    },
  ];

  ngAfterViewInit(): void {
    this.drawCanvas();
  }

  drawCanvas() {
    const canvas = this.canvasRef.nativeElement;

    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, this.figureWidth, this.figureHeight);

    ctx.beginPath();

    const head = this.getPosition(1);
    const radius = (this.figureWidth * 5) / 100;
    ctx.arc(head.x, head.y + radius, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    this.stickFigureLines.forEach((el) => {
      const from = this.getPosition(el.id);
      const to = this.getPosition(el.toId);

      ctx.beginPath();

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);

      ctx.stroke();

      if (el.sensor) {
        ctx.beginPath();
        ctx.arc(from.x, from.y, (this.figureWidth * 2) / 100, 0, Math.PI * 2);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = this.getSensorFill(el.sensor.sensorId);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(el.sensor.sensorId.toString(), from.x, from.y);
      }
    });
  }

  getPosition(id: number) {
    const lineJoint = this.stickFigureLines.find((el) => el.id == id)!;

    return {
      x: lineJoint.x * this.figureWidth,
      y: lineJoint.y * this.figureWidth,
    };
  }

  getSensorFill(sensorId: number) {
    return (
      { G: 'green', R: 'red', Y: 'yellow' }[this.sensorStatus[sensorId - 1]] ||
      'lightgrey'
    );
  }

  updateSensors() {
    if (this.sensorInput.invalid) {
      this.sensorInput.markAsTouched();
      this.sensorInput.markAsDirty();
      return;
    }

    this.sensorStatus = this.sensorInput.value?.toUpperCase().split('')!;
    this.drawCanvas();
  }
}

interface StickFigure {
  id: number;
  x: number;
  y: number;
  toId: number;
  slug: string;
  sensor?: Sensor | undefined;
}

enum SensorStatus {
  G,
  R,
  Y,
}

interface Sensor {
  sensorId: number;
  status?: SensorStatus | '';
  slug?: string;
  x?: number;
  y?: number;
}
