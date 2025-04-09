// ThreeJS ile 3D Sanal Kampüs
document.addEventListener('DOMContentLoaded', function() {
    // 3D canvas yüklendiğinde
    const campusCanvas = document.getElementById('campus-canvas');
    
    // Yardım panelini aç/kapa
    const helpToggle = document.getElementById('help-toggle');
    const helpPanel = document.querySelector('.help-panel');
    
    helpToggle.addEventListener('click', function() {
        helpPanel.classList.toggle('active');
    });
    
    // Bina bilgi paneli işlemleri
    const infoPanel = document.querySelector('.info-panel');
    const closeInfoBtn = document.querySelector('.close-info');
    
    // ThreeJS için gerekli değişkenler
    let scene, camera, renderer, controls;
    let buildings = []; // 3D binalar
    
    // Three.js kurulumu - Basit bir örnek
    function initThreeJS() {
        // Sahne oluştur
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xE9ECEF);
        
        // Kamera oluştur
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - 72), 0.1, 1000);
        camera.position.set(50, 30, 50);
        
        // Renderer oluştur
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(campusCanvas.clientWidth, campusCanvas.clientHeight);
        renderer.shadowMap.enabled = true;
        campusCanvas.appendChild(renderer.domElement);
        
        // Orbit Controls (kamerayı kontrol etme) ekle
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 20;
        controls.maxDistance = 100;
        controls.maxPolarAngle = Math.PI / 2 - 0.05;
        
        // Işıklandırma
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 0);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        
        // Kampüs zemini
        createGround();
        
        // Binalar ekle
        addBuildings();
        
        // Pencere yeniden boyutlandırma işleyicisi
        window.addEventListener('resize', onWindowResize);
        
        // Animasyon döngüsü
        animate();
    }
    
    // Zemin oluştur
    function createGround() {
        // Zemin geometrisi
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        
        // Zemin dokusu
        const textureLoader = new THREE.TextureLoader();
        const grassTexture = textureLoader.load('grass.jpg');
        grassTexture.wrapS = THREE.RepeatWrapping;
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(20, 20);
        
        // Zemin malzemesi
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: grassTexture,
            side: THREE.DoubleSide
        });
        
        // Zemin mesh'i oluştur
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        
        // Basit yollar ekle
        const roadGeometry = new THREE.PlaneGeometry(5, 60);
        const roadMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            side: THREE.DoubleSide
        });
        
        const mainRoad = new THREE.Mesh(roadGeometry, roadMaterial);
        mainRoad.rotation.x = -Math.PI / 2;
        mainRoad.position.y = 0.01; // Yerden biraz yüksek
        scene.add(mainRoad);
        
        const crossRoad = new THREE.Mesh(roadGeometry, roadMaterial);
        crossRoad.rotation.x = -Math.PI / 2;
        crossRoad.rotation.z = Math.PI / 2;
        crossRoad.position.y = 0.01;
        scene.add(crossRoad);
    }
    
    // Binaları oluştur ve ekle
    function addBuildings() {
        // Bina türleri ve konumları
        const buildingData = [
            { name: 'Mühendislik Fakültesi', position: { x: 20, z: 15 }, color: 0xE3A15D, scale: { x: 15, y: 12, z: 15 } },
            { name: 'Rektörlük', position: { x: -15, z: -20 }, color: 0x507D8B, scale: { x: 10, y: 8, z: 10 } },
            { name: 'Merkez Kütüphane', position: { x: -20, z: 15 }, color: 0x8D6E63, scale: { x: 12, y: 10, z: 18 } },
            { name: 'Yemekhane', position: { x: 5, z: -15 }, color: 0xAED581, scale: { x: 10, y: 6, z: 10 } },
            { name: 'Spor Kompleksi', position: { x: 25, z: -25 }, color: 0x42A5F5, scale: { x: 15, y: 8, z: 20 } }
        ];
        
        buildingData.forEach((building, index) => {
            createBuilding(building, index);
        });
    }
    
    // Bina oluşturma fonksiyonu
    function createBuilding(buildingData, index) {
        const { name, position, color, scale } = buildingData;
        
        // Bina geometrisi ve malzemesi
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: color });
        
        // Binayı oluştur
        const building = new THREE.Mesh(geometry, material);
        building.position.set(position.x, scale.y / 2, position.z);
        building.scale.set(scale.x, scale.y, scale.z);
        building.castShadow = true;
        building.receiveShadow = true;
        building.userData = { name, index };
        
        // Sahneye ekle
        scene.add(building);
        buildings.push(building);
        
        // Çatı ekle
        const roofGeometry = new THREE.ConeGeometry(Math.max(scale.x, scale.z) / 1.5, scale.y / 4, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x8B0000 }); // Koyu kırmızı çatı
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        
        roof.position.y = scale.y / 2 + scale.y / 8;
        roof.rotation.y = Math.PI / 4;
        building.add(roof);
        
        // Pencereler ekle
        addWindows(building, scale);
    }
    
    // Binalara pencere ekle
    function addWindows(building, scale) {
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
        const windowMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xADD8E6,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        
        // Ön yüz pencereleri
        const frontSide = scale.z / 2 + 0.05;
        for (let x = -scale.x / 2 + 2; x < scale.x / 2 - 1; x += 2) {
            for (let y = -scale.y / 2 + 2; y < scale.y / 2 - 1; y += 3) {
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                windowMesh.position.set(x, y, frontSide);
                windowMesh.rotation.y = Math.PI;
                building.add(windowMesh);
            }
        }
        
        // Arka yüz pencereleri
        const backSide = -scale.z / 2 - 0.05;
        for (let x = -scale.x / 2 + 2; x < scale.x / 2 - 1; x += 2) {
            for (let y = -scale.y / 2 + 2; y < scale.y / 2 - 1; y += 3) {
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                windowMesh.position.set(x, y, backSide);
                building.add(windowMesh);
            }
        }
        
        // Yan yüz pencereleri
        const rightSide = scale.x / 2 + 0.05;
        for (let z = -scale.z / 2 + 2; z < scale.z / 2 - 1; z += 2) {
            for (let y = -scale.y / 2 + 2; y < scale.y / 2 - 1; y += 3) {
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                windowMesh.position.set(rightSide, y, z);
                windowMesh.rotation.y = Math.PI / 2;
                building.add(windowMesh);
            }
        }
        
        // Diğer yan yüz pencereleri
        const leftSide = -scale.x / 2 - 0.05;
        for (let z = -scale.z / 2 + 2; z < scale.z / 2 - 1; z += 2) {
            for (let y = -scale.y / 2 + 2; y < scale.y / 2 - 1; y += 3) {
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                windowMesh.position.set(leftSide, y, z);
                windowMesh.rotation.y = -Math.PI / 2;
                building.add(windowMesh);
            }
        }
    }
    
    // Pencere yeniden boyutlandırma işlevleri
    function onWindowResize() {
        camera.aspect = window.innerWidth / (window.innerHeight - 72);
        camera.updateProjectionMatrix();
        renderer.setSize(campusCanvas.clientWidth, campusCanvas.clientHeight);
    }
    
    // Animasyon döngüsü
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    // Ray casting için tıklama işleyicisi
    function onClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(x, y);
        
        raycaster.setFromCamera(mouse, camera);
        
        const intersects = raycaster.intersectObjects(buildings);
        
        if (intersects.length > 0) {
            const selectedBuilding = intersects[0].object;
            
            // Bina bilgilerini göster
            showBuildingInfo(selectedBuilding.userData);
        }
    }
    
    // Bina bilgilerini görüntüle
    function showBuildingInfo(buildingData) {
        // Bina bilgilerini doldur
        const buildingTitleElement = infoPanel.querySelector('h4');
        buildingTitleElement.textContent = buildingData.name;
        
        // İçeriği binaya göre güncelle
        const contentElements = {
            'Mühendislik Fakültesi': {
                image: 'Kbu.Mühendislik fakültesi.jpg',
                details: [
                    { label: 'Konum', value: 'Ana Kampüs, A Blok' },
                    { label: 'Açılış Saatleri', value: '08:00 - 23:00' },
                    { label: 'İçerik', value: 'Derslikler, Laboratuvarlar, Öğretim Üyesi Ofisleri, Konferans Salonu' }
                ]
            },
            'Merkez Kütüphane': {
                image: 'Kbu.Kütüphane.png',
                details: [
                    { label: 'Konum', value: 'Ana Kampüs, Merkez' },
                    { label: 'Açılış Saatleri', value: '08:00 - 22:00' },
                    { label: 'İçerik', value: 'Çalışma Alanları, Kitap Koleksiyonu, Elektronik Kaynaklar, Grup Çalışma Odaları' }
                ]
            },
            'Rektörlük': {
                image: 'Kbu_Kapı_Yakın.jpg',
                details: [
                    { label: 'Konum', value: 'Ana Kampüs, İdari Bina' },
                    { label: 'Açılış Saatleri', value: '08:30 - 17:30' },
                    { label: 'İçerik', value: 'Rektörlük Makamı, İdari Birimler, Toplantı Salonları' }
                ]
            },
            'Yemekhane': {
                image: 'campus-placeholder.jpg',
                details: [
                    { label: 'Konum', value: 'Ana Kampüs, Merkez' },
                    { label: 'Açılış Saatleri', value: '11:30 - 14:00, 17:00 - 19:30' },
                    { label: 'İçerik', value: 'Ana Yemek Salonu, Kafeterya, Fast-Food Köşesi' }
                ]
            },
            'Spor Kompleksi': {
                image: 'campus-placeholder.jpg',
                details: [
                    { label: 'Konum', value: 'Ana Kampüs, Güney Bölgesi' },
                    { label: 'Açılış Saatleri', value: '09:00 - 22:00' },
                    { label: 'İçerik', value: 'Kapalı Spor Salonu, Fitness Merkezi, Yüzme Havuzu, Açık Sahalar' }
                ]
            }
        };
        
        // Bina içeriğini güncelle
        const imageElement = infoPanel.querySelector('.building-image img');
        const detailsElement = infoPanel.querySelector('.info-details');
        
        const buildingContent = contentElements[buildingData.name];
        if (buildingContent) {
            imageElement.src = buildingContent.image;
            
            // Detayları temizle ve yeniden oluştur
            detailsElement.innerHTML = '';
            buildingContent.details.forEach(detail => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
                detailsElement.appendChild(p);
            });
        }
        
        // Bilgi panelini göster
        infoPanel.classList.add('active');
    }
    
    // Bilgi panelini kapat
    closeInfoBtn.addEventListener('click', function() {
        infoPanel.classList.remove('active');
    });
    
    // Binaların üzerine tıklama
    campusCanvas.addEventListener('click', onClick);
    
    // Kontrol butonları
    const controlButtons = document.querySelectorAll('.control-btn');
    
    controlButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif sınıfı kaldır
            controlButtons.forEach(btn => btn.classList.remove('active'));
            
            // Tıklanan butona aktif sınıfı ekle
            this.classList.add('active');
            
            // Kontrol modunu değiştir
            const id = this.id;
            
            switch(id) {
                case 'rotate-view':
                    controls.enableRotate = true;
                    controls.enablePan = false;
                    controls.enableZoom = false;
                    break;
                case 'pan-view':
                    controls.enableRotate = false;
                    controls.enablePan = true;
                    controls.enableZoom = false;
                    break;
                case 'zoom-view':
                    controls.enableRotate = false;
                    controls.enablePan = false;
                    controls.enableZoom = true;
                    break;
                case 'reset-view':
                    // Kamera konumunu sıfırla
                    camera.position.set(50, 30, 50);
                    camera.lookAt(0, 0, 0);
                    controls.reset();
                    // Döndürme modu etkinleştir
                    controls.enableRotate = true;
                    controls.enablePan = false;
                    controls.enableZoom = false;
                    // Döndürme butonunu aktif yap
                    controlButtons.forEach(btn => btn.classList.remove('active'));
                    document.getElementById('rotate-view').classList.add('active');
                    break;
            }
        });
    });
    
    // Popüler yer kartlarına tıklama
    const placeCards = document.querySelectorAll('.place-card');
    
    placeCards.forEach(card => {
        card.addEventListener('click', function() {
            const target = this.dataset.target;
            
            // Kamerayı binaya doğrult
            switch(target) {
                case 'library':
                    moveCameraToBuilding(2); // Kütüphane indeksi
                    break;
                case 'engineering':
                    moveCameraToBuilding(0); // Mühendislik Fakültesi indeksi
                    break;
                case 'cafeteria':
                    moveCameraToBuilding(3); // Yemekhane indeksi
                    break;
                case 'sports':
                    moveCameraToBuilding(4); // Spor Kompleksi indeksi
                    break;
                case 'rectoratebuilding':
                    moveCameraToBuilding(1); // Rektörlük indeksi
                    break;
            }
        });
    });
    
    // Kamerayı belirli bir binaya doğrult
    function moveCameraToBuilding(buildingIndex) {
        if (buildingIndex >= 0 && buildingIndex < buildings.length) {
            const building = buildings[buildingIndex];
            const position = building.position.clone();
            
            // Binaya doğru animasyonlu hareket (basit)
            const targetPosition = new THREE.Vector3(
                position.x + 15,
                position.y + 10,
                position.z + 15
            );
            
            // Kamerayı hedef konuma taşı
            camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            controls.target.set(position.x, position.y, position.z);
            
            // Bina bilgilerini göster
            showBuildingInfo(building.userData);
        }
    }
    
    // Kat planları işlemleri
    const floorButtons = document.querySelectorAll('.floor-btn');
    floorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif sınıfı kaldır
            floorButtons.forEach(btn => btn.classList.remove('active'));
            
            // Tıklanan butona aktif sınıfı ekle
            this.classList.add('active');
            
            // Kat planını güncelle (basit olması için sadece görsel değişimi)
            // Gerçek uygulamada kat planlarını yükleyebilirsiniz
            document.getElementById('floor-image').src = `floor-plan-${this.dataset.floor}.jpg`;
        });
    });
    
    // Three.js'yi başlat
    initThreeJS();
}); 