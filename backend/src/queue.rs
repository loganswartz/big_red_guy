use anyhow::Result;
use rocket::async_trait;
use std::sync::Arc;

#[async_trait]
pub trait Task: Send + Sync {
    async fn run(&self) -> Result<()> {
        println!("Running task!");
        Ok(())
    }

    async fn failed(&self) -> Result<()> {
        println!("Task failed!");
        Ok(())
    }
}

pub type Queue = deadqueue::limited::Queue<Box<dyn Task>>;
pub type ManagedQueue = Arc<Queue>;

const WORKER_COUNT: usize = 10;
const TASK_COUNT: usize = WORKER_COUNT * 10;

pub struct TaskQueue {}

impl TaskQueue {
    /// Create a new task queue and spawn workers to process tasks.
    pub fn new() -> Arc<Queue> {
        Arc::new(Queue::new(TASK_COUNT))
    }

    /// Spawn workers to process tasks.
    ///
    /// Must be called after Rocket / Tokio has been initialized.
    pub fn start(queue: Arc<Queue>) {
        for worker in 0..WORKER_COUNT {
            let queue = queue.clone();
            tokio::spawn(async move {
                loop {
                    let task = queue.pop().await;
                    println!("Worker[{}] received a task!", worker);
                    if let Err(e) = task.run().await {
                        println!("Worker[{}] failed to run task: {:?}", worker, e);
                        task.failed().await.ok();
                    }
                }
            });
        }
    }
}
