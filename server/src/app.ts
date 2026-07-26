import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import testRoutes from "./routes/test.route";
import menuRoutes from "./routes/menu.route";
import availabilityRoutes from "./routes/availability.route";

import orderRoutes from "./routes/order.route";
import aiRoutes from "./routes/ai.route";




const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/test", testRoutes);
app.use("/menu", menuRoutes);
app.use("/availability", availabilityRoutes);
app.use("/orders", orderRoutes);
app.use("/ai", aiRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Restaurant Flow Intelligence API is running.'
  });
});

export default app;