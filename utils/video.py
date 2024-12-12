import cv2
import time
from typing import Generator, Optional
from werkzeug.datastructures import FileStorage

class VideoStream:
    def __init__(self):
        self.cap = None
        self.test_video = None
        self.last_frame_time = 0
        self.frame_interval = 1.0 / 25

    def start_camera(self):
        if self.cap is None:
            self.cap = cv2.VideoCapture(0, cv2.CAP_V4L2)
            self.cap.set(cv2.CAP_PROP_FPS, 25)
            self.cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    def set_test_video(self, video_file: FileStorage) -> None:
        # Save uploaded video to temporary file
        temp_path = "/tmp/test_video.mp4"
        video_file.save(temp_path)
        self.test_video = cv2.VideoCapture(temp_path)

    def read_frame(self) -> tuple[bool, Optional[cv2.Mat]]:
        if self.test_video is not None:
            ret, frame = self.test_video.read()
            if not ret:  # Video ended, loop back
                self.test_video.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = self.test_video.read()
            return ret, frame
        
        if self.cap is None:
            self.start_camera()
            
        current_time = time.time()
        time_diff = current_time - self.last_frame_time
        
        if time_diff < self.frame_interval:
            time.sleep(self.frame_interval - time_diff)
            
        ret, frame = self.cap.read()
        if ret:
            self.last_frame_time = time.time()
            
        return ret, frame

    def generate_frames(self, detector) -> Generator[bytes, None, None]:
        while True:
            ret, frame = self.read_frame()
            if not ret:
                break
                
            frame = detector.process_frame(frame)
            
            try:
                _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            except Exception as e:
                print(f"Error encoding frame: {e}")
                continue

    def release(self):
        if self.cap is not None:
            self.cap.release()
        if self.test_video is not None:
            self.test_video.release()