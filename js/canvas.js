// Canvas Storage System for SVG handling
class CanvasStorage {
    constructor(userId) {
        this.userId = userId;
        this.canvasData = {};
        this.storageKey = `canvasData_${userId}`;
        this.loadFromLocalStorage();
    }

    getCanvasKey(questionId, partId, sectionId = null) {
        return sectionId !== null ? 
            `section_${sectionId}_q${questionId}_p${partId}` : 
            `q${questionId}_p${partId}`;
    }

    saveCanvasAsSVG(canvas, questionId, partId, sectionId = null) {
        try {
            const key = this.getCanvasKey(questionId, partId, sectionId);
            const svgData = this.canvasToSVG(canvas);
            this.canvasData[key] = {
                svg: svgData,
                timestamp: new Date().toISOString(),
                dimensions: {
                    width: canvas.width,
                    height: canvas.height
                }
            };
            
            this.saveToLocalStorage();
            console.log(`Saved canvas ${key} as SVG for user ${this.userId}`);
            return svgData;
        } catch (error) {
            console.error('Error saving canvas:', error);
            return null;
        }
    }

    loadCanvasFromSVG(canvas, questionId, partId, sectionId = null) {
        try {
            const key = this.getCanvasKey(questionId, partId, sectionId);
            const canvasData = this.canvasData[key];
            
            if (canvasData && canvasData.svg) {
                this.loadSVGToCanvas(canvas, canvasData.svg);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading canvas:', error);
            return false;
        }
    }

    canvasToSVG(canvas) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', canvas.width);
        svg.setAttribute('height', canvas.height);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        
        // Convert canvas to data URL and embed as image in SVG
        const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        image.setAttribute('width', canvas.width);
        image.setAttribute('height', canvas.height);
        image.setAttribute('href', canvas.toDataURL('image/png'));
        
        svg.appendChild(image);
        return new XMLSerializer().serializeToString(svg);
    }

    loadSVGToCanvas(canvas, svgData) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = reject;
            
            // Extract the image data from SVG
            try {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
                const imageElement = svgDoc.querySelector('image');
                if (imageElement) {
                    img.src = imageElement.getAttribute('href');
                } else {
                    reject(new Error('No image found in SVG'));
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    exportAllCanvases() {
        try {
            const exportData = {
                userId: this.userId,
                timestamp: new Date().toISOString(),
                version: '1.0',
                canvases: this.canvasData
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `canvas-drawings_${this.userId}_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return Object.keys(this.canvasData).length;
        } catch (error) {
            console.error('Export failed:', error);
            throw error;
        }
    }

    async importCanvases(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.canvases) {
                        reject(new Error('Invalid canvas data format'));
                        return;
                    }
                    
                    // Merge with existing data
                    this.canvasData = { ...this.canvasData, ...data.canvases };
                    this.saveToLocalStorage();
                    
                    resolve(Object.keys(data.canvases).length);
                } catch (error) {
                    reject(new Error('Failed to parse canvas data: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    saveToLocalStorage() {
        try {
            const data = {
                canvases: this.canvasData,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                const parsed = JSON.parse(data);
                this.canvasData = parsed.canvases || {};
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            this.canvasData = {};
        }
    }

    getAllCanvasKeys() {
        return Object.keys(this.canvasData);
    }

    getCanvasCount() {
        return Object.keys(this.canvasData).length;
    }

    clearAllCanvases() {
        this.canvasData = {};
        this.saveToLocalStorage();
    }

    deleteCanvas(questionId, partId, sectionId = null) {
        const key = this.getCanvasKey(questionId, partId, sectionId);
        delete this.canvasData[key];
        this.saveToLocalStorage();
    }
}
