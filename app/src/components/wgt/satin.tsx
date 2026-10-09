import { useEffect, useRef } from "react";

// Hero background: slow satin folds in the brand palette (navy base, violet
// body, blue to magenta sheen). One fragment shader on a full-section canvas;
// the CSS gradient on .w-satin is the fallback when WebGL is unavailable.

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `precision mediump float;
uniform vec2 r;
uniform float t;
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = (gl_FragCoord.xy - 0.5 * r) / r.y;
  float k = t * 0.07;
  float a = p.x * 0.85 + p.y * 0.55;
  float w = sin(p.y * 1.6 + k * 1.3) * 0.35 + sin(p.x * 1.1 - k) * 0.25;
  float f = a * 3.0 + w * 2.2 + sin(a * 1.4 + k * 0.8) * 0.9;
  float shade = sin(f) * 0.5 + 0.5;
  float sheen = pow(max(0.0, cos(f) * 0.5 + 0.5), 7.0);
  vec3 bg = vec3(0.024, 0.031, 0.102);
  vec3 body = mix(bg, vec3(0.09, 0.055, 0.25), shade);
  vec3 hl = mix(vec3(0.12, 0.23, 1.0), vec3(0.88, 0.13, 0.54), smoothstep(0.2, 1.0, uv.x));
  vec3 col = body + hl * sheen * 0.42;
  col *= mix(0.55, 1.0, smoothstep(0.0, 0.75, uv.x));
  col = mix(bg, col, smoothstep(0.0, 0.3, uv.y));
  gl_FragColor = vec4(col, 1.0);
}`;

export function Satin({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(program, "r");
    const uTime = gl.getUniformLocation(program, "t");

    // Soft gradients: low resolution is invisible and keeps phones cool.
    const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.6;
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    let visible = true;
    const draw = (now: number) => {
      gl.uniform1f(uTime, still ? 12 : (now - start) / 1000 + 12);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still && visible) frame = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (still) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && !still) frame = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    resize();
    canvas.dataset.ready = "";
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div aria-hidden="true" className={className ? `w-satin ${className}` : "w-satin"}>
      <canvas ref={canvasRef} />
    </div>
  );
}
