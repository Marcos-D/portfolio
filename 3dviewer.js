class ModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }

        // Clear any existing content
        this.container.innerHTML = '';

        this.scene = new THREE.Scene();
        
        // Set up camera
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(2, 2, 2);
        this.camera.lookAt(0, 0, 0);

        // Set up renderer with transparency
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // Add lights with theme-aware colors
        this.setupLights();

        // Animation
        this.mixer = null;
        this.clock = new THREE.Clock();

        // Handle window resize
        this.resizeHandler = () => this.onWindowResize();
        window.addEventListener('resize', this.resizeHandler, false);

        // Handle theme changes
        this.themeObserver = new MutationObserver(() => this.updateTheme());
        this.themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Start animation loop
        this.animationFrameId = null;
        this.animate();
    }

    setupLights() {
        // Remove existing lights
        this.scene.children = this.scene.children.filter(child => !(child instanceof THREE.Light));

        const isDarkTheme = document.documentElement.getAttribute('data-theme') !== 'light';
        
        // Ambient light - brighter in light mode
        const ambientIntensity = isDarkTheme ? 0.5 : 0.7;
        const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
        this.scene.add(ambientLight);

        // Directional light - adjusted for theme
        const directionalIntensity = isDarkTheme ? 0.8 : 1.2;
        const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    updateTheme() {
        this.setupLights();
    }

    loadModel(url) {
        console.log('Loading model from:', url);
        const loader = new THREE.FBXLoader();
        
        // Add loading indicator
        this.container.style.cursor = 'wait';
        
        loader.load(
            url,
            (fbx) => {
                console.log('Model loaded successfully');
                
                // Scale and position the model
                fbx.scale.setScalar(0.05);  // Adjust scale as needed
                
                // Center the model
                const box = new THREE.Box3().setFromObject(fbx);
                const center = box.getCenter(new THREE.Vector3());
                fbx.position.sub(center);

                // Fix materials for light mode
                fbx.traverse((child) => {
                    if (child.isMesh) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.color.convertSRGBToLinear();
                            });
                        } else if (child.material) {
                            child.material.color.convertSRGBToLinear();
                        }
                    }
                });

                // Setup animation
                this.mixer = new THREE.AnimationMixer(fbx);
                if (fbx.animations.length > 0) {
                    console.log('Found animations:', fbx.animations.length);
                    const action = this.mixer.clipAction(fbx.animations[0]);
                    action.play();
                }

                this.scene.add(fbx);

                // Reset camera and controls
                const distance = box.min.distanceTo(box.max);
                this.camera.position.set(distance, distance/2, distance);
                this.controls.target.copy(new THREE.Vector3(0, 0, 0));
                this.controls.update();
                
                // Reset cursor
                this.container.style.cursor = 'grab';
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model:', error);
                this.container.style.cursor = 'auto';
                this.container.innerHTML = '<div style="color: var(--text-color); text-align: center; padding: 20px;">Error loading model: ' + error.message + '</div>';
            }
        );
    }

    animate = () => {
        this.animationFrameId = requestAnimationFrame(this.animate);
        
        // Update animation mixer
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.container) return;
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    cleanup() {
        // Stop theme observer
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }

        // Stop animation loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Remove event listeners
        window.removeEventListener('resize', this.resizeHandler);

        // Dispose of Three.js objects
        if (this.mixer) {
            this.mixer.stopAllAction();
        }

        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        if (this.renderer) {
            this.renderer.dispose();
        }

        // Clear the container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 