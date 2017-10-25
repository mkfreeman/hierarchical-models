# Generate random salary data

# Set up
library(dplyr) # data wrangling
library(lme4) # modeling
library(ggplot2) # visualization
library(arm) # standard errors

# Parameters for generating faculty salary data
departments <- c('sociology', 'biology', 'english', 'informatics', 'statistics')
base.salaries <- c(40000, 50000, 60000, 70000, 80000)
annual.raises <- c(2000, 500, 500, 1700, 500)
faculty.per.dept <- 20
total.faculty <- faculty.per.dept * length(departments)

# Generate dataframe of faculty and (random) years of experience
ids <- 1:total.faculty
department <- rep(departments, faculty.per.dept)
experience <- floor(runif(total.faculty, 0, 10))
bases <- rep(base.salaries, faculty.per.dept) * runif(total.faculty, .9, 1.1) # noise
raises <- rep(annual.raises, faculty.per.dept) * runif(total.faculty, .9, 1.1) # noise
df <- data.frame(ids, department, bases, experience, raises)

# Generate salaries (base + experience * raise)
df <- df %>% mutate(
    salary = bases + experience * raises
)

# Model without respect to grouping
m0 <- lm(salary ~ experience, data=df)
predict(m0)
df$simple.model <- predict(m0)

# Model with varying intercept
m1 <- lmer(salary ~ experience + (1|department), data = df)
df$random.intercpet.preds <- predict(m1)

# Model with varying slope
m2 <- lmer(salary ~ experience + (0 + experience|department), data=df)
df$random.slope.preds <- predict(m2)

# Model with varying slope and intercept
m3 <- lmer(salary ~ experience + (1 + experience|department), data=df)
df$random.slope.int.preds <- predict(m3)

# Save data and models
write.csv(df, "public/data/faculty-data.csv", row.names=F)

# Some plots using ggplot2

# Visualize random intercept
vary.int.graph <- ggplot(data=df, aes(x=experience, y=random.intercpet.preds, group = department, colour = department)) +
  geom_line() + 
  labs(x="Experience", y="Predicted Salary") +
  ggtitle("Varying Intercept Salary Prediction") + 
  scale_colour_discrete('Department')     

# Visualize random slope
vary.slope.graph <- ggplot(data=df, aes(x=experience, y=random.slope.preds, group = department, colour = department)) +
  geom_line() + 
  labs(x="Experience", y="Predicted Salary") +
  ggtitle("Varying Slope Salary Prediction") + 
  scale_colour_discrete('Department')

# Visualize random slope + intercept
vary.slope.int.graph <- ggplot(data=df, aes(x=experience, y=random.slope.int.preds, group = department, colour = department)) +
  geom_line() + 
  labs(x="Experience", y="Predicted Salary") +
  ggtitle("Varying Slope and Intercept Salary Prediction") + 
  scale_colour_discrete('Department')

# Visualize with data
model.with.data <- ggplot(data=df, aes(x=experience, y=random.slope.int.preds, group = department, colour = department)) +
  geom_line() + 
  geom_point(aes(x=experience, y=salary, group = department, colour = department)) +
  labs(x="Experience", y="Predicted Salary") +
  ggtitle("Varying Slope and Intercept Salary Prediction") + 
  scale_colour_discrete('Department')
