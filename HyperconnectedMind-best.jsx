import React, { useRef, useEffect } from 'react';

const COLORS = {
  void: '#030308',
  logic: '#00ffcc',
  code: '#00ff88',
  pattern: '#ff00aa',
  memory: '#ffaa00',
  creative: '#aa00ff',
  sensory: '#ff4466',
  language: '#4488ff',
  weak: '#446688',
  flash: '#ffffcc',
  nodeCore: '#ffffff',
  nodePulse: '#aaeeff',
};

class ThoughtNode {
  constructor(x, y, z, w, v, category) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.v = v;
    this.category = category;
    this.energy = 0.5 + Math.random() * 0.5;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.03 + Math.random() * 0.04;
    this.size = 1.5 + Math.random() * 2.5;
    this.activation = 0.3 + Math.random() * 0.4;
    this.targetActivation = this.activation;
    this.vx = (Math.random() - 0.5) * 0.003;
    this.vy = (Math.random() - 0.5) * 0.003;
    this.vz = (Math.random() - 0.5) * 0.003;
    this.vw = (Math.random() - 0.5) * 0.002;
    this.vv = (Math.random() - 0.5) * 0.002;
    this.age = 0;
    this.maxAge = 600 + Math.random() * 800;
    this.life = 1;
  }
  
  update() {
    this.age++;
    this.pulsePhase += this.pulseSpeed;
    
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    this.w += this.vw;
    this.v += this.vv;
    
    const bound = 2.2;
    if (Math.abs(this.x) > bound) this.vx -= this.x * 0.002;
    if (Math.abs(this.y) > bound) this.vy -= this.y * 0.002;
    if (Math.abs(this.z) > bound) this.vz -= this.z * 0.002;
    if (Math.abs(this.w) > bound) this.vw -= this.w * 0.001;
    if (Math.abs(this.v) > bound) this.vv -= this.v * 0.001;
    
    this.activation += (this.targetActivation - this.activation) * 0.08;
    this.targetActivation *= 0.992;
    this.targetActivation = Math.max(0.2, this.targetActivation);
    
    if (this.age > this.maxAge) {
      this.life -= 0.01;
    }
    
    return this.life > 0;
  }
  
  activate(amount = 0.5) {
    this.targetActivation = Math.min(1, this.targetActivation + amount);
  }
  
  getColor() {
    const colors = {
      logic: COLORS.logic,
      code: COLORS.code,
      pattern: COLORS.pattern,
      memory: COLORS.memory,
      creative: COLORS.creative,
      sensory: COLORS.sensory,
      language: COLORS.language,
    };
    return colors[this.category] || COLORS.logic;
  }
}

class Connection {
  constructor(nodeA, nodeB, strength = 0.5) {
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.strength = strength;
    this.activity = 0;
    this.pulsePosition = Math.random();
    this.pulseSpeed = 0.015 + Math.random() * 0.025;
    this.pulseDirection = Math.random() > 0.5 ? 1 : -1;
  }
  
  update() {
    this.pulsePosition += this.pulseSpeed * this.pulseDirection;
    if (this.pulsePosition > 1) { this.pulsePosition = 1; this.pulseDirection = -1; }
    if (this.pulsePosition < 0) { this.pulsePosition = 0; this.pulseDirection = 1; }
    this.activity = (this.nodeA.activation + this.nodeB.activation) * 0.5 * this.strength;
  }
}

class TokenStream {
  constructor() {
    this.tokens = [];
    this.baseY = (Math.random() - 0.5) * 1.8;
    this.baseZ = (Math.random() - 0.5) * 1.8;
    this.speed = 0.012 + Math.random() * 0.018;
    this.hue = 180 + Math.random() * 40;
    this.life = 1;
    this.maxTokens = 12 + Math.floor(Math.random() * 15);
    
    for (let i = 0; i < this.maxTokens; i++) {
      this.tokens.push({
        x: -2.5 + (i / this.maxTokens) * 5,
        y: this.baseY + (Math.random() - 0.5) * 0.3,
        z: this.baseZ + (Math.random() - 0.5) * 0.3,
        size: 0.4 + Math.random() * 0.5,
        alpha: 0.4 + Math.random() * 0.5,
      });
    }
  }
  
  update() {
    this.tokens.forEach((token, i) => {
      token.x += this.speed;
      if (token.x > 3) {
        token.x = -3;
        token.y = this.baseY + (Math.random() - 0.5) * 0.3;
      }
      token.y += Math.sin(token.x * 2 + i * 0.5) * 0.002;
    });
    this.life -= 0.0004;
    return this.life > 0;
  }
}

const project5Dto2D = (x, y, z, w, v, time) => {
  const a1 = time * 0.00025;
  const a2 = time * 0.0002;
  const a3 = time * 0.0003;
  
  const x1 = x * Math.cos(a1) - w * Math.sin(a1);
  const w1 = x * Math.sin(a1) + w * Math.cos(a1);
  
  const y1 = y * Math.cos(a2) - v * Math.sin(a2);
  const v1 = y * Math.sin(a2) + v * Math.cos(a2);
  
  const z1 = z * Math.cos(a3) - w1 * Math.sin(a3);
  const w2 = z * Math.sin(a3) + w1 * Math.cos(a3);
  
  const perspective = 3;
  const scale4 = perspective / Math.max(0.5, perspective - w2 * 0.5);
  const scale5 = perspective / Math.max(0.5, perspective - v1 * 0.5);
  const finalScale = scale4 * scale5;
  
  return {
    x: x1 * finalScale,
    y: y1 * finalScale,
    z: z1,
    scale: Math.max(0.3, Math.min(finalScale, 3)),
  };
};

export default function HyperconnectedMind() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const categories = ['logic', 'code', 'pattern', 'memory', 'creative', 'sensory', 'language'];
    let nodes = [];
    let connections = [];
    let tokenStreams = [];
    let lastSpawnTime = 0;
    let frameCount = 0;
    
    // Create initial nodes
    for (let i = 0; i < 70; i++) {
      nodes.push(new ThoughtNode(
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.5,
        categories[Math.floor(Math.random() * categories.length)]
      ));
    }
    
    // Create connections - balanced frequency
    const rebuildConnections = () => {
      connections = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dw = nodes[i].w - nodes[j].w;
          const dv = nodes[i].v - nodes[j].v;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz + dw*dw*0.5 + dv*dv*0.5);
          
          // Middle ground: 1.8 range
          if (dist < 1.8) {
            connections.push(new Connection(nodes[i], nodes[j], 1 - dist / 1.8));
          } 
          // Same category connections - 12%
          else if (nodes[i].category === nodes[j].category && Math.random() < 0.12) {
            connections.push(new Connection(nodes[i], nodes[j], 0.3));
          } 
          // Random long-distance connections - 0.8%
          else if (Math.random() < 0.008) {
            connections.push(new Connection(nodes[i], nodes[j], 0.2));
          }
        }
      }
    };
    
    rebuildConnections();
    
    // Initial token streams
    for (let i = 0; i < 4; i++) {
      tokenStreams.push(new TokenStream());
    }
    
    let width, height, centerX, centerY, scale;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      centerX = width / 2;
      centerY = height / 2;
      scale = Math.min(width, height) * 0.25;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const startTime = performance.now();
    
    const hexAlpha = (a) => {
      const clamped = Math.min(1, Math.max(0, a));
      return Math.floor(clamped * 255).toString(16).padStart(2, '0');
    };
    
    const animate = (time) => {
      const currentTime = time - startTime;
      frameCount++;
      
      // Clear completely
      ctx.fillStyle = COLORS.void;
      ctx.fillRect(0, 0, width, height);
      
      // Update nodes
      nodes = nodes.filter(node => node.update());
      
      // Spawn new nodes
      if (currentTime - lastSpawnTime > 400 && nodes.length < 100 && nodes.length > 0) {
        const parent = nodes[Math.floor(Math.random() * nodes.length)];
        const child = new ThoughtNode(
          parent.x + (Math.random() - 0.5) * 0.8,
          parent.y + (Math.random() - 0.5) * 0.8,
          parent.z + (Math.random() - 0.5) * 0.8,
          parent.w + (Math.random() - 0.5) * 0.5,
          parent.v + (Math.random() - 0.5) * 0.5,
          Math.random() < 0.6 ? parent.category : categories[Math.floor(Math.random() * categories.length)]
        );
        nodes.push(child);
        parent.activate(0.5);
        child.activate(0.7);
        lastSpawnTime = currentTime;
      }
      
      // Rebuild connections periodically
      if (frameCount % 120 === 0) {
        rebuildConnections();
      }
      
      // Update connections
      connections.forEach(conn => conn.update());
      
      // Update token streams
      tokenStreams = tokenStreams.filter(s => s.update());
      if (tokenStreams.length < 5 && Math.random() < 0.015) {
        tokenStreams.push(new TokenStream());
      }
      
      // Random activation bursts
      if (Math.random() < 0.02 && nodes.length > 0) {
        const burstNode = nodes[Math.floor(Math.random() * nodes.length)];
        burstNode.activate(0.8);
        // Activate nearby nodes too
        nodes.forEach(n => {
          const dx = n.x - burstNode.x;
          const dy = n.y - burstNode.y;
          const dz = n.z - burstNode.z;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < 1 && n !== burstNode) {
            n.activate(0.4 * (1 - dist));
          }
        });
      }
      
      // === DRAW TOKEN STREAMS ===
      tokenStreams.forEach(stream => {
        stream.tokens.forEach(token => {
          const proj = project5Dto2D(token.x, token.y, token.z, 0, 0, currentTime);
          const sx = centerX + proj.x * scale;
          const sy = centerY + proj.y * scale;
          const sz = token.size * proj.scale * 12;
          const alpha = token.alpha * stream.life * proj.scale * 0.7;
          
          if (sx > -50 && sx < width + 50 && sy > -50 && sy < height + 50) {
            const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, sz);
            gradient.addColorStop(0, `hsla(${stream.hue}, 80%, 70%, ${alpha})`);
            gradient.addColorStop(0.4, `hsla(${stream.hue}, 70%, 50%, ${alpha * 0.4})`);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(sx, sy, sz, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
      
      // === DRAW CONNECTIONS ===
      ctx.lineCap = 'round';
      connections.forEach(conn => {
        const projA = project5Dto2D(conn.nodeA.x, conn.nodeA.y, conn.nodeA.z, conn.nodeA.w, conn.nodeA.v, currentTime);
        const projB = project5Dto2D(conn.nodeB.x, conn.nodeB.y, conn.nodeB.z, conn.nodeB.w, conn.nodeB.v, currentTime);
        
        const ax = centerX + projA.x * scale;
        const ay = centerY + projA.y * scale;
        const bx = centerX + projB.x * scale;
        const by = centerY + projB.y * scale;
        
        // Balanced alpha
        const alpha = (conn.strength * 0.3 + conn.activity * 0.5) * conn.nodeA.life * conn.nodeB.life;
        if (alpha < 0.02) return;
        
        // Main connection line
        const gradient = ctx.createLinearGradient(ax, ay, bx, by);
        gradient.addColorStop(0, conn.nodeA.getColor() + hexAlpha(alpha * 0.7));
        gradient.addColorStop(0.5, COLORS.weak + hexAlpha(alpha * 0.9));
        gradient.addColorStop(1, conn.nodeB.getColor() + hexAlpha(alpha * 0.7));
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 0.8 + conn.activity * 3 + conn.strength * 0.8;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        
        // Pulse
        if (conn.activity > 0.12) {
          const px = ax + (bx - ax) * conn.pulsePosition;
          const py = ay + (by - ay) * conn.pulsePosition;
          const pulseSize = 6 + conn.activity * 12;
          const pulseGradient = ctx.createRadialGradient(px, py, 0, px, py, pulseSize);
          pulseGradient.addColorStop(0, COLORS.flash + hexAlpha(conn.activity * 0.9));
          pulseGradient.addColorStop(0.5, COLORS.flash + hexAlpha(conn.activity * 0.4));
          pulseGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = pulseGradient;
          ctx.beginPath();
          ctx.arc(px, py, pulseSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // === DRAW NODES ===
      nodes.forEach(node => {
        const proj = project5Dto2D(node.x, node.y, node.z, node.w, node.v, currentTime);
        const sx = centerX + proj.x * scale;
        const sy = centerY + proj.y * scale;
        
        if (sx < -100 || sx > width + 100 || sy < -100 || sy > height + 100) return;
        
        const pulse = Math.sin(node.pulsePhase) * 0.25 + 0.75;
        const baseSize = node.size * proj.scale * 8;
        const size = baseSize * (1 + node.activation * 0.4);
        const alpha = (node.energy * 0.4 + node.activation * 0.6) * pulse * node.life;
        
        // Outer glow
        const outerGradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 4);
        outerGradient.addColorStop(0, node.getColor() + hexAlpha(alpha * 0.7));
        outerGradient.addColorStop(0.3, node.getColor() + hexAlpha(alpha * 0.35));
        outerGradient.addColorStop(0.6, node.getColor() + hexAlpha(alpha * 0.1));
        outerGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(sx, sy, size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner activation glow
        if (node.activation > 0.3) {
          const innerGradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, size * 2);
          innerGradient.addColorStop(0, COLORS.nodePulse + hexAlpha(node.activation * 0.6));
          innerGradient.addColorStop(0.5, COLORS.nodePulse + hexAlpha(node.activation * 0.2));
          innerGradient.addColorStop(1, 'transparent');
          ctx.fillStyle = innerGradient;
          ctx.beginPath();
          ctx.arc(sx, sy, size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Core
        ctx.fillStyle = COLORS.nodeCore + hexAlpha(alpha * 0.95);
        ctx.beginPath();
        ctx.arc(sx, sy, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // === VIGNETTE ===
      const vignetteGradient = ctx.createRadialGradient(
        centerX, centerY, Math.min(width, height) * 0.15,
        centerX, centerY, Math.max(width, height) * 0.7
      );
      vignetteGradient.addColorStop(0, 'transparent');
      vignetteGradient.addColorStop(0.5, 'transparent');
      vignetteGradient.addColorStop(1, 'rgba(3, 3, 8, 0.75)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: COLORS.void,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      
      <div style={{
        position: 'absolute',
        bottom: 25,
        left: 25,
        pointerEvents: 'none',
        opacity: 0.45,
      }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 'clamp(1rem, 2vw, 1.3rem)',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: '#aaccff',
          textTransform: 'uppercase',
        }}>
          Hyperconnected
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.5rem',
          letterSpacing: '0.2em',
          color: 'rgba(170, 200, 255, 0.5)',
          marginTop: 3,
        }}>
          NEURODIVERGENT THOUGHT TOPOLOGY
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        top: 15,
        right: 15,
        pointerEvents: 'none',
        opacity: 0.35,
        fontFamily: 'monospace',
        fontSize: '0.45rem',
        letterSpacing: '0.08em',
        lineHeight: 1.7,
        textAlign: 'right',
      }}>
        <div style={{ color: COLORS.logic }}>● LOGIC</div>
        <div style={{ color: COLORS.code }}>● CODE</div>
        <div style={{ color: COLORS.pattern }}>● PATTERN</div>
        <div style={{ color: COLORS.memory }}>● MEMORY</div>
        <div style={{ color: COLORS.creative }}>● CREATIVE</div>
        <div style={{ color: COLORS.sensory }}>● SENSORY</div>
        <div style={{ color: COLORS.language }}>● LANGUAGE</div>
      </div>
    </div>
  );
}
