import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

import { Scene, PerspectiveCamera, WebGLRenderer, MeshBasicMaterial, Mesh, CircleGeometry } from 'three';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
})
export class HeadComponent implements AfterViewInit {
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private bgDots: Mesh[] = [];
  private headbgDots: Mesh[] = [];
  private readonly headCoordinates: any[] = [
    [0, 1], // Top
    [0.6, 0.9],
    [1.2, 0.6],
    [1, -1], // Middle
    [0, -1.5],
    [-1, -1],
    [-1.2, 0.6],
    [-0.6, 0.9],
  ];
  private mouse: any;

  @ViewChild('headWrapper') private headWrapper: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.drawDots();
    this.drawHead();
    this.startAnimations();
    this.subscribeToMouseMove();
  }

  private initThreeJs() {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight);

    this.camera.position.z = 5;
    this.camera.position.x = 0;
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.headWrapper.nativeElement.appendChild(this.renderer.domElement);
  }

  private drawDots() {
    const dotMaterial = new MeshBasicMaterial({ color: '#fff' });

    const bgDotsAmount = 500;
    for (var index = 0; index <= bgDotsAmount; index++) {
      const dot = new Mesh(new CircleGeometry(0.01, 32), dotMaterial);
      dot.position.x = Math.random() * (8 - -8 + 0.1) + -8;
      dot.position.y = Math.random() * (4 - -4 + 0.1) + -4;
      dot.position.z = 1;

      this.bgDots.push(dot);
      this.scene.add(dot);
    }
  }

  private drawHead() {
    const dotMaterial = new MeshBasicMaterial({ color: 'red' });

    this.headCoordinates.forEach(([x, y]) => {
      const dot = new Mesh(new CircleGeometry(0.02, 32), dotMaterial);
      dot.position.x = x;
      dot.position.y = y;

      this.headbgDots.push(dot);
      this.scene.add(dot);
    });
  }

  private subscribeToMouseMove() {
    fromEvent(document, 'mousemove')
      .pipe()
      .subscribe(({ clientX, clientY }: MouseEvent) => {
        this.mouse = [clientX, clientY];
      });
  }

  private startAnimations() {
    requestAnimationFrame(this.startAnimations.bind(this));

    if (this.mouse) {
      this.headbgDots.forEach((dot, index: number) => {
        const diffX = this.mouse[0] - window.innerWidth / 2;
        const diffY = this.mouse[1] - window.innerHeight / 2;

        dot.position.x = (diffX * 0.001) + this.headCoordinates[index][0];
        dot.position.y = (diffY * 0.001) + this.headCoordinates[index][1];
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}
