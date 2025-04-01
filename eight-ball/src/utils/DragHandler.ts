export class DragHandler {
    private isDragging = false;
    private isAnimating = false;
    private startX = 0;
    private startY = 0;
    private lastX = 0;
    private lastY = 0;
    private velocityX = 0;
    private velocityY = 0;
    private lastTime = 0;
    private currentX = 0;
    private currentY = 0;
    private dragStartX = 0;
    private dragStartY = 0;

    constructor(
        private element: HTMLElement,
        private onThrow: () => void,
        private throwThreshold = 1.5,
        private cooldownTime = 500 // ms to wait after throw
    ) {
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.init();
    }

    private init(): void {
        this.element.addEventListener('mousedown', this.handleMouseDown);
        this.element.addEventListener('touchstart', this.handleMouseDown as any);
        this.element.addEventListener('transitionend', this.handleAnimationEnd);
    }

    private handleMouseDown(e: MouseEvent | TouchEvent): void {
        if (this.isAnimating) return;

        this.isDragging = true;
        const pos = this.getEventPosition(e);

        // Store the initial drag position relative to current position
        this.dragStartX = pos.x - this.currentX;
        this.dragStartY = pos.y - this.currentY;

        this.element.classList.remove('eight-ball--throwing');
        this.element.style.transition = 'none';

        this.lastX = pos.x;
        this.lastY = pos.y;
        this.lastTime = Date.now();

        this.element.classList.add('eight-ball--dragging');

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('touchmove', this.handleMouseMove as any);
        document.addEventListener('touchend', this.handleMouseUp as any);

        // Prevent default to avoid text selection during drag
        e.preventDefault();
    }

    private handleMouseMove(e: MouseEvent | TouchEvent): void {
        if (!this.isDragging || this.isAnimating) return;

        const pos = this.getEventPosition(e);
        const currentTime = Date.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;

        // Calculate velocity
        this.velocityX = (pos.x - this.lastX) / deltaTime;
        this.velocityY = (pos.y - this.lastY) / deltaTime;

        // Calculate new position relative to drag start
        const x = pos.x - this.dragStartX;
        const y = pos.y - this.dragStartY;

        // Update current position
        this.currentX = x;
        this.currentY = y;

        this.element.style.transform = `translate(${x}px, ${y}px)`;

        this.lastX = pos.x;
        this.lastY = pos.y;
        this.lastTime = currentTime;

        e.preventDefault();
    }

    private handleMouseUp(): void {
        if (!this.isDragging) return;
        this.isDragging = false;

        const velocity = Math.sqrt(
            this.velocityX * this.velocityX +
            this.velocityY * this.velocityY
        );

        if (velocity > this.throwThreshold * 1000) {
            this.isAnimating = true;
            this.element.style.transition = '';
            this.element.classList.add('eight-ball--throwing');
            
            // Reset position on throw
            this.currentX = 0;
            this.currentY = 0;
            this.element.style.transform = 'translate(0, 0)';
            
            this.onThrow();

            setTimeout(() => {
                this.isAnimating = false;
            }, this.cooldownTime);
        } else {
            // Maintain current position if not thrown
            this.element.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
        }

        this.element.classList.remove('eight-ball--dragging');

        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        document.removeEventListener('touchmove', this.handleMouseMove as any);
        document.removeEventListener('touchend', this.handleMouseUp as any);
    }

    private handleAnimationEnd(): void {
        this.element.classList.remove('eight-ball--throwing');
    }

    private getEventPosition(e: MouseEvent | TouchEvent) {
        if ('touches' in e) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
}